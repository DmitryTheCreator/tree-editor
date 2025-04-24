import { identifiers } from "./fixtures";

export interface ItemDTO {
  id: number | string;
  parent: number | string | null;
  label: string;
}

type IdentifierTypes = (typeof identifiers)[number];

export type TreeItem = {
  [K in keyof ItemDTO]: K extends IdentifierTypes
    ? Exclude<ItemDTO[K], string>
    : ItemDTO[K];
};

export interface Storable {
  getAll(): TreeItem[];
  getItem(id: number): TreeItem | null;
  getChildren(id: number): TreeItem[];
  getAllChildren(id: number): TreeItem[];
  getAllParents(id: number): TreeItem[];
  addItem(item: TreeItem): boolean;
  removeItem(id: number): boolean;
  updateItem(item: Pick<TreeItem, "id"> & Partial<TreeItem>): boolean;
}
