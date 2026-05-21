import AdminCard from "./AdminCard.jsx";

export default function AdminGrid({ admins = [], currentAdminId = null, onDelete = () => {}, onRoleChange = () => {} }) {
  if (!admins || admins.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {admins.map((admin) => (
        <AdminCard
          key={admin.admin_id}
          admin={admin}
          onDelete={onDelete}
          onRoleChange={onRoleChange}
          isSelf={admin.admin_id === currentAdminId}
        />
      ))}
    </div>
  );
}
