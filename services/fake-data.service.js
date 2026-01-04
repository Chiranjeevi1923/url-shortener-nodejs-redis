import { faker } from "@faker-js/faker";

export const generateFakeAdmin = () => {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
    };
};
