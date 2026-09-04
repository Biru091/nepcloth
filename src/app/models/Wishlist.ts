import mongoose, {
  Schema,
  Document,
  Model,
} from "mongoose";

export interface IWishlistItem {
  productId: string;
}

export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistItemSchema =
  new Schema<IWishlistItem>(
    {
      productId: {
        type: String,
        required: true,
      },
    },
    {
      _id: false,
    }
  );

const WishlistSchema =
  new Schema<IWishlist>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
      },

      items: {
        type: [WishlistItemSchema],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

const Wishlist: Model<IWishlist> =
  mongoose.models.Wishlist ||
  mongoose.model<IWishlist>(
    "Wishlist",
    WishlistSchema
  );

export default Wishlist;