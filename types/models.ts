export interface Product {
  ProductName: string;
  Description: string;
  Category: string;
  Price: number;
  Stock: number;
}

export interface ReturnItem {
  ProductName: string;
  Description: string;
  Category: string;
  Price: number;
  Stock: number;
}

export type UserRole = 'admin' | 'staff';

export interface User {
  googleId?: string;
  UserName: string;
  DisplayName: string;
  email: string;
  Role: UserRole;
}

export interface Ledger {
  ProductID: string;
  ProductName: string;
  Description: string;
  Category: string;
  CoGS: number;
  Quantity: number;
  Price: number;
  TotalPrice: number;
  DateOfPurchase: string;
  SoldBy: string;
}

export interface AppJwtPayload {
  id: string;
  UserName: string;
  email: string;
  Role: UserRole;
}
