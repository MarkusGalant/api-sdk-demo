import { useUsers } from "./hooks/useUsers";

export function App() {
  const { data: users = [], isLoading, isError, error } = useUsers();

  return (
    <div>
      <h1>Users</h1>
      {isLoading && (<p>Loading...</p>)}
      {isError && (<p>Error: {error.message}</p>)}
      {users.length && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}


