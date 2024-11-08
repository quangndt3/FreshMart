import Products from "../models/products";
import UnSoldProduct from "../models/unsoldProducts";
import Shipment from "../models/shipment";
import {
  validateShipment,
  validateUpdateShipment,
} from "../validation/shipment";

const checkExprie = (date) => {
  try {
    // Chuyển đổi chuỗi ngày từ MongoDB thành đối tượng Date
    const targetDate = new Date(date);
    // Lấy ngày hiện tại
    const currentDate = new Date();

    // Số mili giây trong 7 ngày
    const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;

    //Kiểm tra xem sản phẩm trong lô đã hết hạn chưa
    if (targetDate - currentDate <= 0) {
      return 2
    }

    // Kiểm tra xem thời gian hiện tại đến ngày cụ thể có cách 3 ngày không
    const isWithinSevenDays = targetDate - currentDate < sevenDaysInMillis;

    if (
      isWithinSevenDays &&
      targetDate - currentDate > 0
    ) {
      return 1
    }
    return 0
  } catch (error) {
    console.log(error.message);
  }
}

export const createShipment = async (req, res) => {
  const { error } = validateShipment.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(401).json({
      status: 401,
      message: error.details.map((error) => error.message),
    });
  }
  try {
    req.body.products = req.body.products.map((data) => {
      return {
        ...data,
        originWeight: data.weight,
        willExpire: checkExprie(data.date) || 0
      };
    });
    const newShipment = await Shipment.create(req.body);
    req.body.products.map(async (data) => {
      await Products.findByIdAndUpdate(data.idProduct, {
        $push: {
          shipments: {
            idShipment: newShipment._id,
            originWeight: data.weight,
            weight: data.weight,
            date: data.date,
            originPrice: data.originPrice,
            price: data.price,
            willExpire: 0
          },
        },
      });
    });

    return res.status(201).json({
      body: {
        data: newShipment,
      },
      status: 201,
      message: "Create shipment successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

export const findAll = async (req, res) => {
  try {
    const {
      _page = 1,
      _order = "desc",
      _limit = 10000,
      _sort = "createdAt",
      _q = "",
    } = req.query;
    const options = {
      page: _page,
      limit: _limit,
      sort: {
        [_sort]: _order === "desc" ? -1 : 1,
      },
      populate: "products.idProduct",
    };
    const shipments = await Shipment.paginate({}, options);

    if (!shipments.docs) {
      return res.status(404).json({
        status: 404,
        message: "There are no shipments",
      });
    }

    return res.status(201).json({
      body: {
        data: shipments.docs,
        pagination: {
          currentPage: shipments.page,
          totalPages: shipments.totalPages,
          totalItems: shipments.totalDocs,
        },
      },
      status: 201,
      message: "Get shipments successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};
export const findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const shipment = await Shipment.findById(id).populate("products.idProduct");

    if (!shipment)
      return res
        .status(404)
        .json({ status: 404, message: "No Shipment found" });

    return res.status(200).json({
      body: {
        data: shipment,
      },
      status: 200,
      message: "Get Shipment success",
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

export const updateShipment = async (req, res) => {
  const { error } = validateUpdateShipment.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(401).json({
      status: 401,
      message: error.details.map((error) => error.message),
    });
  }
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment)
      return res
        .status(404)
        .json({ status: 404, message: "No Shipment found" });

    const shipmentUpdate = await Shipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (shipmentUpdate.isDisable) {
      const products = await Products.find()
      for (let product of products) {
        //Xóa shipment trong bảng products
        await Products.findOneAndUpdate({ _id: product._id, "shipments.idShipment": shipmentUpdate._id }, {
          $pull: {
            shipments: {
              idShipment: shipmentUpdate._id
            }
          }
        })

      }
      //Chuyển tất cả sp trong lô đó sang hàng thất thoát (sp ế)

      for (let item of shipmentUpdate.products) {
        const product = await Products.findById(item.idProduct)
        const originalID = product._id
        // //nếu sp gốc đó đã có trong kho ế thì chỉ update lại shipments
        // const unsoldExist = await UnSoldProduct.findOne({ originalID });
        // if (unsoldExist) {
        //   console.log("running: ", shipment)
        //   const unsold = await UnSoldProduct.findOneAndUpdate(
        //     { originalID },
        //     {
        //       $push: {
        //         shipments: {
        //           shipmentId: shipment._id,
        //           purchasePrice: item.originPrice,
        //           weight: item.weight,
        //           date: item.date
        //         },
        //       },
        //     },
        //     { new: true }
        //   )
        //   console.log("Đã push shipment vào...", unsold)

        // } else {
        const data = await UnSoldProduct.create({
          originalID,
          productName: product.productName,
          shipments: [
            {
              shipmentId: shipment._id,
              purchasePrice: item.originPrice,
              weight: item.weight,
              date: item.date
            },
          ],
        }
        )
        console.log("Create: ", data)


      }
    }
    //======================================================================//
    const productsOfShipment = shipmentUpdate.products;
    for (let product of productsOfShipment) {
      await Products.findByIdAndUpdate(
        { _id: product.idProduct },
        {
          $pull: {
            shipments: shipmentUpdate._id,
          },
        }
      );
    }
    return res.status(200).json({
      status: 200,
      body: {
        data: shipmentUpdate,
      },
      message: "Updated shipment complete",
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

export const removeShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const shipment = await Shipment.findById(id);

    if (!shipment)
      return res
        .status(404)
        .json({ status: 404, message: "No Shipment found" });

    shipment.products.map(async (product) => {
      await Products.findByIdAndUpdate(product.idProduct, {
        $pull: {
          shipments: { idShipment: shipment._id },
        },
      });
    });

    await Shipment.findByIdAndRemove(shipment._id);

    return res.status(200).json({ status: 200, message: "Removed shipment" });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};
