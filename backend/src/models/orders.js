import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import shortMongoId from "short-mongo-id";
import { statusOrder } from "../config/constants";
const orderSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
      default: function () {
        return shortMongoId(this._id);
      },
    },
    userId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        shipmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Shipment",
          required: true,
        },
        isSale: {
          type: Boolean,
          default: false,
        },
        originName: {
          type: String,
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        images: {
          type: String,
          required: true,
        },

        weight: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        evaluation: {
          type: Boolean,
          default: false,
        },
      },
    ],
    totalPayment: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "momo", "vnpay"],
      default: "cod"
    },
    customerName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: null,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    receivedDate: {
      type: String,
      default: null,
    },
    pay: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: statusOrder,
      default: "chờ xác nhận",
    },
    voucher: {
      code: {
        type: String,
        default: null,
      },
      miniMumOrder: {
        type: Number,
        default: null,
      },
      maxReduce: {
        type: Number,
        default: null,
      },
      percent: {
        type: Number,
        default: null,
      },
    }

    // orderDate:{
    //     type:String,
    //     default:function(){
    //         const currentDate = new Date();
    //         const formattedDate = `${("0" + currentDate.getDate()).slice(-2)}-${("0" + (currentDate.getMonth() + 1)).slice(-2)}-${currentDate.getFullYear()}`
    //         return formattedDate;
    //     }
    // }
  },
  { versionKey: false, timestamps: true }
);
orderSchema.plugin(mongoosePaginate);
export default mongoose.model("Orders", orderSchema);
