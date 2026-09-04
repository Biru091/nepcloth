import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

// =====================================================
// ORDER ITEM
// =====================================================

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
}

// =====================================================
// PAYMENT SCREENSHOT
// =====================================================

export interface PaymentScreenshot {
  data: string;
  contentType: string;
}

// =====================================================
// ORDER
// =====================================================

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;

  email: string;

  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };

  items: OrderItem[];

  subtotal: number;
  shipping: number;
  total: number;

  paymentMethod: "cod" | "online";

  transactionCode: string | null;

  paymentScreenshot: PaymentScreenshot | null;

  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

  paymentStatus:
    | "pending"
    | "paid"
    | "failed";

  createdAt: Date;
  updatedAt: Date;
}

// =====================================================
// ORDER ITEM SCHEMA
// =====================================================

const OrderItemSchema =
  new Schema<OrderItem>(
    {
      productId: {
        type: String,
        required: true,
        trim: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      price: {
        type: Number,
        required: true,
        min: 0,
      },

      size: {
        type: String,
        required: true,
        trim: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
      },
    },
    {
      _id: false,
    }
  );

// =====================================================
// ORDER SCHEMA
// =====================================================

const OrderSchema =
  new Schema<IOrder>(
    {
      // =================================================
      // USER
      // =================================================

      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      // =================================================
      // EMAIL
      // =================================================

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 254,
      },

      // =================================================
      // CUSTOMER
      // =================================================

      customer: {
        firstName: {
          type: String,
          required: true,
          trim: true,
          maxlength: 100,
        },

        lastName: {
          type: String,
          required: true,
          trim: true,
          maxlength: 100,
        },

        phone: {
          type: String,
          required: true,
          trim: true,
          maxlength: 30,
        },

        address: {
          type: String,
          required: true,
          trim: true,
          maxlength: 500,
        },

        city: {
          type: String,
          required: true,
          trim: true,
          maxlength: 100,
        },

        postalCode: {
          type: String,
          required: true,
          trim: true,
          maxlength: 20,
        },
      },

      // =================================================
      // PRODUCTS
      // =================================================

      items: {
        type: [OrderItemSchema],
        required: true,

        validate: {
          validator: (
            items: OrderItem[]
          ) => {
            return (
              Array.isArray(items) &&
              items.length > 0
            );
          },

          message:
            "Order must contain at least one item",
        },
      },

      // =================================================
      // PRICE
      // =================================================

      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },

      shipping: {
        type: Number,
        required: true,
        min: 0,
      },

      total: {
        type: Number,
        required: true,
        min: 0,
      },

      // =================================================
      // PAYMENT METHOD
      // =================================================

      paymentMethod: {
        type: String,

        enum: [
          "cod",
          "online",
        ],

        required: true,
      },

      // =================================================
      // TRANSACTION CODE
      // =================================================

      transactionCode: {
        type: String,
        trim: true,
        maxlength: 200,
        default: null,
      },

      // =================================================
      // PAYMENT SCREENSHOT
      // =================================================

      paymentScreenshot: {
        data: {
          type: String,
          default: null,
        },

        contentType: {
          type: String,
          default: null,
        },
      },

      // =================================================
      // ORDER STATUS
      // =================================================

      status: {
        type: String,

        enum: [
          "pending",
          "confirmed",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ],

        default: "pending",
        index: true,
      },

      // =================================================
      // PAYMENT STATUS
      // =================================================

      paymentStatus: {
        type: String,

        enum: [
          "pending",
          "paid",
          "failed",
        ],

        default: "pending",
        index: true,
      },
    },

    {
      timestamps: true,
    }
  );

// =====================================================
// INDEXES
// =====================================================

// Find user's orders quickly
OrderSchema.index({
  userId: 1,
  createdAt: -1,
});

// =====================================================
// MODEL
// =====================================================

const Order: Model<IOrder> =
  mongoose.models.Order ||
  mongoose.model<IOrder>(
    "Order",
    OrderSchema
  );

export default Order;