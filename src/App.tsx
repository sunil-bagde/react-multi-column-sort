
import sortBy from "sort-by";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";

import {peopleSeed} from "./seeds/user.seed"

const tableColumn = [
  { id:1,label: "Name", property: "name" },
  { id:2,label: "Title", property: "title" },
  { id:3,label: "Email", property: "email" },
  { id:4,label: "Role", property: "role" },
];



enum SortingType {
  Ascending = "asc",
  Descending = "desc",
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

  const splitParam = (currentSortType, by = ":") =>
    currentSortType.split(by) ?? [];

  const handleSort = useCallback(
    (propertyName) => {
      let sortConfig = sortParam.length > 0 ? sortParam : [];
      const index = sortConfig?.findIndex((config) =>
        config.startsWith(propertyName),
      );

      if (index > -1) {
        const currentSortType = sortConfig[index];
        const [propName, direction] = splitParam(currentSortType);
        sortConfig.splice(index, 1);

        propName && !direction
          ? (sortConfig = [
              ...sortConfig,
              `${propertyName}:${SortingType.Descending}`,
            ])
          : [];
      } else {
        sortConfig = [...sortConfig, `${propertyName}`];
      }
      const newSearchParams = new URLSearchParams({});

      sortConfig.forEach((key) => {
        newSearchParams.append("sort", key);
      });
      setSearchParams(newSearchParams);
    },
    [sortParam, setSearchParams],
  );

  const sorter = sortParam.reduce((acc, currentSortType) => {
    const [propName, direction] = splitParam(currentSortType);

    if (propName && SortingType.Descending === direction) {
      acc.push(`-${propName}`);
    }
    if (propName && !direction) {
      acc.push(propName);
    }
    return acc;
  }, []);

  const sortedPeople = [...peopleSeed].sort(sortBy(...sorter));

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
                      {tableColumn.map(({id, label, property}, index) => {
                        const direction = getSortDirection(
                          property,
                          sorter,
                        );
                        return (
                          <th
                            key={id}
                            scope="col"
                            className="py-3.5 px-3 first:pl-4 text-left text-sm text-gray-900 first:sm:pl-6"
                          >
                            <button
                              onClick={() => {
                                handleSort(property);
                              }}
                              className="inline-flex font-semibold group"
                            >
                              {label}
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
