import { canAccessDepartment } from "@/app/auth/guards";

export default function ProductEdit() {
  return <div>Product Edit</div>;

  //   if (!canAccessDepartment(user, product.department_id)) {
  //   return <Unauthorized />;
  // }
}
