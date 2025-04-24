import { TreeItem, ItemDTO, Storable } from "./types";
import { identifiers } from "./fixtures";

export class TreeStore implements Storable {
  private itemsMap = new Map<number, TreeItem>();
  private childrenMap = new Map<number | null, Set<number>>();
  private parentOf = new Map<number, number | null>();

  constructor(items: ItemDTO[]) {
    for (const dto of items) {
      const clone = { ...dto };

      for (const key of identifiers) {
        const value = clone[key];
        if (typeof value === "string") {
          const numericValue = parseInt(value, 10);
          clone[key] = Number.isNaN(numericValue) ? value : numericValue;
        }
      }

      const item = clone as TreeItem;
      const id = item.id;
      const parentId = item.parent;
      this.itemsMap.set(id, item);
      this.parentOf.set(id, parentId);

      if (!this.childrenMap.has(parentId)) {
        this.childrenMap.set(parentId, new Set());
      }
      this.childrenMap.get(parentId)!.add(id);

      if (!this.childrenMap.has(id)) {
        this.childrenMap.set(id, new Set());
      }
    }
  }

  getAll(): TreeItem[] {
    return Array.from(this.itemsMap.values());
  }

  getItem(id: number): TreeItem | null {
    return this.itemsMap.get(id) ?? null;
  }

  getChildren(id: number): TreeItem[] {
    const childrenIds = this.childrenMap.get(id);
    if (!childrenIds) return [];
    return Array.from(childrenIds, (childId) => this.itemsMap.get(childId)!);
  }

  getAllChildren(id: number): TreeItem[] {
    const result: TreeItem[] = [];
    const stack = [...(this.childrenMap.get(id) ?? [])];
    while (stack.length) {
      const childId = stack.pop()!;
      const child = this.itemsMap.get(childId)!;
      result.push(child);

      for (const grandChildId of this.childrenMap.get(childId) ?? []) {
        stack.push(grandChildId);
      }
    }
    return result;
  }

  getAllParents(id: number): TreeItem[] {
    const result: TreeItem[] = [];
    let current = this.itemsMap.get(id);
    if (!current) return result;
    result.push(current);

    while (current.parent !== null) {
      const parent = this.itemsMap.get(current.parent);
      if (!parent) break;
      result.push(parent);
      current = parent;
    }
    return result;
  }

  addItem(item: TreeItem): boolean {
    const id = item.id;
    if (this.itemsMap.has(id)) return false;

    const parentId = item.parent;
    this.itemsMap.set(id, item);
    this.parentOf.set(id, parentId);

    if (!this.childrenMap.has(id)) {
      this.childrenMap.set(id, new Set());
    }
    if (!this.childrenMap.has(parentId)) {
      this.childrenMap.set(parentId, new Set());
    }
    this.childrenMap.get(parentId)!.add(id);
    return true;
  }

  removeItem(id: number): boolean {
    if (!this.itemsMap.has(id)) return false;

    const toDelete = new Set<number>([
      id,
      ...this.getAllChildren(id).map((i) => i.id),
    ]);

    for (const did of toDelete) {
      const parentId = this.parentOf.get(did)!;
      this.childrenMap.get(parentId)?.delete(did);
      this.itemsMap.delete(did);
      this.childrenMap.delete(did);
      this.parentOf.delete(did);
    }
    return true;
  }

  updateItem(item: Pick<TreeItem, "id"> & Partial<TreeItem>): boolean {
    const id = item.id;
    const existing = this.itemsMap.get(id);
    if (!existing) return false;

    if (item.parent !== undefined && item.parent !== existing.parent) {
      this.childrenMap.get(existing.parent)?.delete(id);
      const parentId = item.parent;

      if (!this.childrenMap.has(parentId)) {
        this.childrenMap.set(parentId, new Set());
      }
      this.childrenMap.get(parentId)!.add(id);
      this.parentOf.set(id, parentId);
    }

    const merged = { ...existing, ...item };
    this.itemsMap.set(id, merged as TreeItem);
    return true;
  }
}
