<template>
  <div class="q-pa-md">
    <PageTitle title="Asset Management" />
    <DataTable>
      <template #header>
        <tr>
          <th>Account</th>
          <th>Type</th>
          <th class="text-right">Balance</th>
        </tr>
      </template>
      <template #body>
        <tr v-for="asset in assets" :key="asset.account">
          <td>{{ asset.account }}</td>
          <td>{{ asset.type }}</td>
          <td class="text-right">{{ asset.balance }}</td>
        </tr>
        <tr>
          <td><q-input v-model="newAsset.account" dense placeholder="Account" /></td>
          <td><q-input v-model="newAsset.type" dense placeholder="Type" /></td>
          <td><q-input v-model.number="newAsset.balance" dense type="number" placeholder="Balance" /></td>
        </tr>
      </template>
    </DataTable>
    <ActionButtons @submit="addAsset" @cancel="reset" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import PageTitle from '../components/common/PageTitle.vue';
import DataTable from '../components/common/DataTable.vue';
import ActionButtons from '../components/common/ActionButtons.vue';

export default defineComponent({
  name: 'AssetManagementView',
  components: { PageTitle, DataTable, ActionButtons },
  setup() {
    const assets = reactive([
      { account: 'Bank A', type: 'Checking', balance: 1000 },
      { account: 'Brokerage', type: 'Investment', balance: 5000 }
    ]);
    const newAsset = reactive({ account: '', type: '', balance: 0 });
    function addAsset() {
      assets.push({ ...newAsset });
      reset();
    }
    function reset() {
      newAsset.account = '';
      newAsset.type = '';
      newAsset.balance = 0;
    }
    return { assets, newAsset, addAsset, reset };
  }
});
</script>
