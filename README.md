## Quick Overview

```sh
 
cd react-multi-column-sort
yarn install # same for npm 
```


### `yarn dev` `npm run dev` 

Runs the app in development mode.<br>
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

```jsx
const useSort = () => {
  const [sortConfig, updateSortConfig] = useState([]);

  const sortColumn = useCallback(
    (propertyName, compareFunction) => {
      let pendingChange = [...sortConfig];
      const index = pendingChange.findIndex(
        (config) => config.propertyName === propertyName,
      );
      if (index > -1) {
        //Save the sortType
        var currentSortType = pendingChange[index].sortType;
        //Remove existing config
        pendingChange.splice(index, 1);
        //check if the sort type we saved is descending
        if (currentSortType === SortingType.Ascending) {
          pendingChange = [
            ...pendingChange,
            {
              propertyName: propertyName,
              sortType: SortingType.Descending,
              compareFunction: compareFunction,
            },
          ];
        }
      } else {
        pendingChange = [
          ...pendingChange,
          {
            propertyName: propertyName,
            sortType: SortingType.Ascending,
            compareFunction: compareFunction,
          },
        ];
      }
      updateSortConfig([...pendingChange]);
    },
    [sortConfig],
  );
  return [sortConfig, updateSortConfig, sortColumn];
};
```
