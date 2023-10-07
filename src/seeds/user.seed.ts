import { faker } from "@faker-js/faker";

faker.seed(12);

const createUser = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const name = `${firstName} ${lastName}`;
  const email = faker.internet.email({ firstName, lastName }).toLowerCase();

  return {
    name,
    title: faker.person.jobTitle(),
    email,
    role: faker.person.jobType(),
  };
};
const createUsers = (numUsers = 3) => {
  return Array.from({ length: numUsers }, createUser);
};

export const peopleSeed = createUsers();