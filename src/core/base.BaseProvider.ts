/**
 * This is an abstract controller that should be extended in all controllers
 * 
 * It enforces user to implement CRUD operations for all types
ƒ */

export default abstract class BaseProvider<T> {
  /**
   * To be used for paginated response
   */
  abstract index(): Promise<{
    items: T[];
    total: number;
  }>;

  abstract create(
    createDto: Partial<T> | Partial<T>[],
    entityType: Partial<T>,
  ): Promise<T>;

  abstract show(id: string, entityType: Partial<T>): Promise<T>;

  abstract edit(editDto: Partial<T>, entityType: Partial<T>): Promise<T>;

  abstract delete(
    deleteWithIds: { id: string[] },
    entityType: Partial<T>,
  ): void;
}
