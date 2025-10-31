type UserType = "COACH" | "ATHLETE";

type User = {
  id: string;
  email: string;
  type: UserType;
};

const activeUsers = (): User[] => {
  return [
    { id: "123abc", email: "coach@example.com", type: "COACH" },
    { id: "9637qwe", email: "athlete.runner@example.com", type: "ATHLETE" },
  ];
};

const findActiveUser = (email: string) => {
  const users = activeUsers().filter((user) => {
    return user.email == email;
  });

  return users.length > 0
    ? Promise.resolve({ value: users[0], error: null })
    : Promise.resolve({ value: email, error: "USER_NOT_FOUND" });
};

export { type UserType, type User, activeUsers, findActiveUser };
