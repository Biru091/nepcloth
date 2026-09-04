import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface CartItem {
  productId: string;
  size: string;
  quantity: number;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<CartItem>(
  {
    productId: {
      type: String,
      required: true,
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
    },
  },
  {
    _id: false,
  }
);

const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    items: {
      type: [CartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Cart: Model<ICart> =
  mongoose.models.Cart ||
  mongoose.model<ICart>("Cart", CartSchema);

export default Cart;