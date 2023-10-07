import { faker } from "@faker-js/faker";
import sortBy from "sort-by";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";
faker.seed(12);

const tableColumn = [
  { label: "Name", property: "name" },
  { label: "Title", property: "title" },
  { label: "Email", property: "email" },
  { label: "Role", property: "role" },
];

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
const createUsers = (numUsers = 12) => {
  return Array.from({ length: numUsers }, createUser);
};

const people = createUsers();

enum SortingType {
  Ascending,
  Descending,
}
const getSortDirection = (property, sortConfig) => {
  const findDesc = sortConfig.find((config) => config === `-${property}`);
  const findAsc = sortConfig.find((config) => config === `${property}`);
  if (findDesc) {
    return "rotate-180";
  }
  if (findAsc) {
    return "";
  }
  return "hidden";
};

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();

  const sortParam = searchParams.getAll("sort");

  const handleSort = useCallback(
    (propertyName) => {
      let pendingChange = sortParam.length > 0 ? sortParam : [];
      const index = pendingChange?.findIndex((config) =>
        config.startsWith(propertyName),
      );

      if (index > -1) {
        //Save the sortType
        const currentSortType = pendingChange[index];
        const [propName, direction] = currentSortType.split(":") ?? [];
        //Remove existing config
        pendingChange.splice(index, 1);
        //check if the sort type we saved is Ascending
        if (propName && !direction) {
          pendingChange = [
            ...pendingChange,
            `${propertyName}:${SortingType.Descending}`,
          ];
        }
      } else {
        pendingChange = [...pendingChange, `${propertyName}`];
      }
      const newSearchParams = new URLSearchParams({});
      pendingChange.forEach((key) => {
        newSearchParams.append("sort", key);
      });
      setSearchParams(newSearchParams);
    },
    [sortParam, setSearchParams],
  );

  const sorter = searchParams.getAll("sort").reduce((acc, current) => {
    const [propName, direction] = current.split(":") ?? [];

    if (propName && SortingType.Descending === Number(direction)) {
      acc.push(`-${propName}`);
    }
    if (propName && !direction) {
      acc.push(propName);
    }
    return acc;
  }, []);

  const sortedPeople = [...people].sort(sortBy(...sorter));

  return (
    <div className="max-w-6xl py-8 mx-auto lg:py-16 ">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Users</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the users in your account including their name,
              title, email and role.
            </p>
          </div>
        </div>
        <div className="flex flex-col mt-8">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      {tableColumn.map((column, index) => {
                        const direction = getSortDirection(
                          column.property,
                          sorter,
                        );

                        return (
                          <th
                            key={index}
                            scope="col"
                            className="py-3.5 px-3 first:pl-4 text-left text-sm text-gray-900 first:sm:pl-6"
                          >
                            <button
                              onClick={() => {
                                handleSort(column.property);
                              }}
                              className="inline-flex font-semibold group"
                            >
                              {column.label}
                              <span
                                className={`flex-none ml-2 rounded text-gray-400`}
                              >
                                <ChevronDownIcon
                                  className={`${direction} w-5 h-5`}
                                  aria-hidden="true"
                                />
                              </span>
                            </button>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedPeople.map((person) => (
                      <tr key={person.email}>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                          {person.name}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {person.title}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {person.email}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {person.role}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
