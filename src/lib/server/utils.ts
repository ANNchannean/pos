import { between } from "drizzle-orm";
import type { MySqlColumn } from "drizzle-orm/mysql-core";

export function pagination(url: URL) {
   const page = Number(url.searchParams.get('page')) || 1;
   const limit = Number(url.searchParams.get('limit')) || 10;
   const currenctPage = page || 1;
   const offset = limit * (currenctPage - 1);
   return {
      limit,
      offset
   };
}
export function betweenHelper(url: URL, datetimeColumn: MySqlColumn) {
   const start = url.searchParams.get('start');
   const end = url.searchParams.get('end');

   if (start && end) {
      return between(datetimeColumn, start, end);
   }
   return undefined;
}