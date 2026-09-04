import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IProduct
  extends Document {
  id: string;
  name: string;
  slug: string;

  type: "plain" | "printed";

  print: string | null;
  printCoverage: string | null;

  price: number;

  trending: boolean;
  newArrival: boolean;

  frontImage: {
    data: Buffer;
    contentType: string;
  };

  backImage: {
    data: Buffer;
    contentType: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema(
  {
    data: {
      type: Buffer,
      required: true,
    },

    contentType: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const ProductSchema =
  new Schema<IProduct>(
    {
      id: {
        type: String,
        required: true,
        unique: true,
      },

      name: {
        type: String,
        required: true,
      },

      slug: {
        type: String,
        required: true,
        unique: true,
      },

      type: {
        type: String,
        enum: ["plain", "printed"],
        required: true,
      },

      print: {
        type: String,
        default: null,
      },

      printCoverage: {
        type: String,
        default: null,
      },

      price: {
        type: Number,
        required: true,
        min: 0,
      },

      trending: {
        type: Boolean,
        default: false,
      },

      newArrival: {
        type: Boolean,
        default: false,
      },

      frontImage: {
        type: ImageSchema,
        required: true,
      },

      backImage: {
        type: ImageSchema,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

const Product =
  mongoose.models.Product ||
  mongoose.model<IProduct>(
    "Product",
    ProductSchema
  );

export default Product;