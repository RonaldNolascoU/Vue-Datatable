<template>
  <div class="flex items-center justify-center">
    <DataTable
      :value="users"
      editMode="cell"
      class="editable-cells-table"
      v-model:expandedRows="expandedRows"
      :rowClass="rowClass"
      @cellEditComplete="onCellEditComplete"
    >
      <Column :expander="true" headerStyle="width: 3rem" />

      <Column
        v-for="column in usersTableColumns"
        :key="column.field"
        :field="column.field"
        :header="column.header"
        :headerStyle="column.width"
      >
        <template #editor="slotProps" v-if="column.field">
          <InputText
            :modelValue="slotProps.data[slotProps.column.props.field]"
            @update:modelValue="onCellEdit($event, slotProps)"
          />
        </template>
      </Column>

      <template #expansion="slotProps">
        <DataTable
          editMode="cell"
          :value="slotProps.data.info"
          class="info-table p-datatable-customers"
          :rowClass="expandedRowClass"
          @cellEditComplete="onCellEditComplete"
        >
          <Column
            v-for="column in expandedTableColumns"
            :key="column.field"
            :field="column.field"
            :header="column.header"
          >
            <template #editor="slotProps">
              <InputText
                v-if="column.field"
                :modelValue="slotProps.data[slotProps.column.props.field]"
                @update:modelValue="onCellEdit($event, slotProps)"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </DataTable>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

export default {
  components: { DataTable, Column, InputText },
  data() {
    return {
      usersTableColumns: [
        {
          field: "type",
          header: "Type",
          width: "",
        },
        {
          field: "count",
          header: "",
          width: "",
        },
        {
          field: null,
          header: "",
          width: "",
        },
      ],
      expandedTableColumns: [
        {
          field: null,
          header: "",
        },
        {
          field: "name",
          header: "",
        },
        {
          field: "role",
          header: "",
        },
      ],
      users: [
        {
          type: "Superusers",
          count: "Count: 2",
          info: [
            {
              id: 1,
              name: "John Doe",
              role: "Accountant",
            },
            {
              id: 2,
              name: "Jane Doe",
              role: "Merchant",
            },
          ],
        },
        {
          type: "Normal users",
          count: "Count: 1",
          info: [
            {
              id: 3,
              name: "John Doe",
              role: "Developer",
            },
          ],
        },
      ],
      expandedRows: [],
      editingCellRows: {},
      usersEditing: null,
      editingValue: null,
    };
  },
  methods: {
    rowClass() {
      return "bg-red-300";
    },
    expandedRowClass() {
      return "bg-yellow-300";
    },
    onCellEdit(newValue, props) {
      if (!this.editingCellRows[props.index]) {
        this.editingCellRows[props.index] = { ...props.data };
      }

      // Condition for expanded row cells
      if (
        props.column.props.field == "name" ||
        props.column.props.field == "role"
      ) {
        this.editingValueID = props.data.id;
      }

      // Setting editing field and value to array
      this.editingCellRows[props.index][props.column.props.field] = newValue;
    },
    onCellEditComplete(event) {
      if (!this.editingCellRows[event.index]) {
        return;
      }

      const editingCellValue = this.editingCellRows[event.index][event.field];

      if (editingCellValue.trim().length > 0) {
        // Condition for expanded row cells
        if (event.field == "name" || event.field == "role") {
          this.updateValue(event, true);
        } else {
          this.updateValue(event);
        }

        // Reset editing cells array in order to prevent issues
        this.editingCellRows = {};
      } else {
        event.preventDefault();
      }
    },
    // Updating value for arrays
    updateValue(event, isExpanded) {
      if (isExpanded) {
        this.users.map((user) => {
          user.info.map((inf) => {
            let infArr = { ...inf };
            // Compare ID from original array and editing cell ID
            if (infArr.id == this.editingValueID) {
              inf = { ...this.editingCellRows[event.index] };

              user.info[event.index] = inf;
            }
          });
        });
      } else {
        this.users[event.index] = { ...this.editingCellRows[event.index] };
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.p-datatable {
  width: 50%;
}

.p-datatable-row-expansion .p-datatable {
  width: 100%;
}

.p-datatable-row-expansion .p-datatable-thead {
  display: none;
}

.p-datatable-row-expansion td:first-child {
  padding: 0 !important;
}

@media screen and (min-width: 1000px) {
  .p-datatable-row-expansion .bg-yellow-300 td:first-child {
    width: 39.75%;
  }

  @media screen and (min-width: 1200px) {
    .p-datatable-row-expansion .bg-yellow-300 td:first-child {
      width: 38.65%;
    }
  }

  @media screen and (min-width: 1400px) {
    .p-datatable-row-expansion .bg-yellow-300 td:first-child {
      width: 37.65%;
    }
  }
}
</style>