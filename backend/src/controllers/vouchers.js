import Joi from "joi";
import Voucher from "../models/vouchers";
import User from "../models/user";
import voucherValid from "../validation/vouchers";

const voucherSchema = Joi.object({
  code: Joi.string().required(),
  miniMumOrder: Joi.number().required(),
  userId: Joi.string().required(),
});

export const validateVoucher = async (req, res) => {
  try {
    const { error } = voucherSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(401).json({
        status: 401,
        message: error.details.map((error) => error.message),
      });
    }
    const { code, miniMumOrder, userId } = req.body;
    const voucherExist = await Voucher.findOne({ code });
    const user = await User.findById(userId);

    //Id user
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found!",
      });
    }
    //Mã ko hợp lệ
    if (!voucherExist) {
      return res.status(404).json({
        status: 404,
        message: "Voucher does not exist!",
      });
    }
    //Hết số lượng
    if (voucherExist.quantity == 0) {
      return res.status(400).json({
        status: 400,
        message: "Voucher is out of quantity!",
      });
    }
    //Voucher ko còn hoạt động
    if (voucherExist.status == false) {
      return res.status(400).json({
        status: 400,
        message: "Voucher does not work!",
      });
    }

    const dateNow = new Date()
    //Voucher đã hết hạn
    const endOfDay = new Date(voucherExist.dateEnd);
    endOfDay.setHours(23, 59, 59, 999);
    if (endOfDay < dateNow) {
      return res.status(400).json({
        status: 400,
        message: "Voucher is out of date",
      });
    }
    //Voucher chưa được bắt đầu sử dụng
    const startOfDay = new Date(voucherExist.dateStart)
    startOfDay.setHours(0, 0, 0, 0);
    if (startOfDay > dateNow) {
      return res.status(400).json({
        status: 400,
        message: "Sorry, this voucher is not yet available for use!",
      });
    }
    //Chưa đạt yc với tối thiểu đơn hàng
    if (voucherExist.miniMumOrder > 0 && voucherExist.miniMumOrder > miniMumOrder) {
      return res.status(400).json({
        status: 400,
        message: "Orders are not satisfactory!",
        miniMumOrder: voucherExist.miniMumOrder
      });
    }
    // user Đã dùng rồi
    const userExist = await Voucher.findOne({ code: req.body.code, "users.userId": req.body.userId })
    if (userExist) {
      return res.status(400).json({
        status: 400,
        message: "This voucher code has already been used. Please enter a different code!",

      });
    }
    // Hợp lệ
    return res.status(200).json({
      status: 200,
      message: "Valid",
      body: { data: voucherExist }
    });

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}
export const createVoucher = async (req, res) => {
  try {
    const { error } = voucherValid.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(401).json({
        status: 401,
        message: error.details.map((error) => error.message),
      });
    }
    const voucherExist = await Voucher.findOne({ code: req.body.code });
    if (voucherExist) {
      return res.status(400).json({
        status: 400,
        message: "This code has existed!",
      });
    }
    if (new Date(req.body.dateStart) > new Date(req.body.dateEnd)) {
      return res.status(400).json({
        status: 400,
        message: "Date invalid",
      });
    }
    const data = await Voucher.create(req.body);
    return res.status(201).json({
      status: 201,
      message: "success",
      body: { data },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};
export const getVoucher = async (req, res) => {
  try {
    const data = await Voucher.findById(req.params.id);
    if (!data) {
      return res.status(404).json({
        status: 404,
        message: "Voucher not found!",
      });
    }
    return res.status(201).json({
      status: 201,
      message: "success",
      body: { data },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};
export const getAllVoucher = async (req, res) => {
  const {
    _page = 1,
    _order = "desc",
    _limit = 9999,
    _sort = "createdAt",

  } = req.query;

  const options = {
    page: _page,
    limit: _limit,
    sort: {
      [_sort]: _order === "desc" ? -1 : 1,
    },
  };
  try {
    const data = await Voucher.paginate({}, options);
    const vouchers = []

    for (let item of data.docs) {
      let isValidDateStart = true
      let isValidDateEnd = true
      const dateNow = new Date()
      // Voucher đã hết hạn
      const endOfDay = new Date(item.dateEnd);
      endOfDay.setHours(23, 59, 59, 999);
      if (endOfDay < dateNow) {
        isValidDateEnd = false;
      }
      // Voucher chưa cho phép 
      const startOfDay = new Date(item.dateStart)
      startOfDay.setHours(0, 0, 0, 0);
      if (startOfDay > dateNow) {
        isValidDateStart = false
      }
      item = item.toObject();
      item.isValidDateStart = isValidDateStart
      item.isValidDateEnd = isValidDateEnd
      vouchers.push(item)
    }
    return res.status(201).json({
      status: 201,
      message: "success",
      body: { data: vouchers },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};
export const removeVoucher = async (req, res) => {
  try {
    const data = await Voucher.findByIdAndDelete(req.params.id);
    return res.status(201).json({
      status: 201,
      message: "Voucher deleted",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};
export const updateVoucher = async (req, res) => {
  try {
    const { quantity, status, code } = req.body
    const voucher = await Voucher.findById(req.params.id)

    const dateStart = new Date(voucher.dateStart)
    const dateEnd = new Date(voucher.dateStart)
    const date_end = new Date(req.body.dateEnd)
    const date_start = new Date(req.body.dateStart)
    let error = false
    if (date_end < date_start) {
      error = true
    }
    if (dateEnd < date_start) {
      error = true
    }
    if (date_end < dateStart) {
      error = true
    }
    if (error) {
      return res.status(400).json({
        status: 400,
        message: "Date invalid!"
      });
    }
    const values = {
      quantity,
      dateEnd: req.body.dateEnd,
      status,
      dateStart: req.body.dateStart
    }
    const data = await Voucher.findByIdAndUpdate(req.params.id, values, { new: true })
    if (!data) {
      return res.status(404).json({
        status: 404,
        message: "Voucher update failed!",
      });
    }
    return res.status(201).json({
      status: 201,
      message: "Voucher update success",
      body: { data }
    })
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}
export const getVoucherUser = async (req, res) => {
  try {
    const { miniMumOrder, userId } = req.body;
    if (!miniMumOrder && typeof miniMumOrder !== "number") {
      return res.status(400).json({
        status: 400,
        message: "miniMumOrder is required!",
      });
    }

    const data = await Voucher.find();
    const vouchers = [];
    const dateNow = new Date();

    for (let item of data) {
      let exist = true;
      let active = true;
      let isValidDate = true
      // Hết số lượng
      if (item.quantity == 0) {
        exist = false;
      }
      // Voucher không còn hoạt động
      if (item.status === false) {
        exist = false;
      }

      // Voucher đã hết hạn
      const endOfDay = new Date(item.dateEnd);
      endOfDay.setHours(23, 59, 59, 999);
      if (endOfDay < dateNow) {
        exist = false;
      }
      // Voucher chưa cho phép 
      const startOfDay = new Date(item.dateStart)
      startOfDay.setHours(0, 0, 0, 0);
      if (startOfDay > dateNow) {
        // exist = false;
        isValidDate = false
      }
      // Kiểm tra xem người dùng đã sử dụng voucher chưa
      if (userId) {
        const userExist = item.users.find(user => user.userId.toString() === userId.toString());
        if (userExist) {
          exist = false;
        }
      }
      //
      if (exist) {
        // Chưa đạt yêu cầu với tối thiểu đơn hàng
        if (item.miniMumOrder > 0 && item.miniMumOrder > miniMumOrder) {
          active = false;
        }
        item = item.toObject();
        item.active = active;
        item.isValidDate = isValidDate
        vouchers.push(item);
      }

    }

    return res.status(200).json({
      status: 200,
      message: "Get voucher success",
      body: { data: vouchers },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};
