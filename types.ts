export type AddressProps = {
    block: string;
    street: string;
    unit: string;
    level: string;
    building: string;
    postal: string;
}

export type StudentProps = {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    mobile: string;
    dateOfBirth: string;
    subjects: string[];
    hobbies: string[];
    address: AddressProps;
    state: string;
    city: string;
}