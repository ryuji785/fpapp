<template>
  <div class="dashboard">
    <header class="header">
      <div class="header-left">
        <span class="hamburger">☰</span>
        <span class="app-name">application</span>
      </div>
      <div class="header-right">
        <div class="user-icon">U</div>
      </div>
    </header>
    <div class="main-area">
      <aside class="sidebar">
        <div v-for="n in 5" :key="n" class="menu-item">Menu {{ n }}</div>
      </aside>
      <section class="content">
        <ul class="item-list">
          <li v-for="(item, index) in items" :key="index" class="item-row">
            <div class="avatar" />
            <div class="item-text">
              <p class="line1">{{ item.title }}</p>
              <p class="line2">{{ item.subtitle }}</p>
            </div>
            <button class="item-action">Action</button>
          </li>
        </ul>
        <div class="profile-panel">
          <div class="profile-avatar" />
          <div class="profile-text">
            <p>Jane Doe</p>
            <p>jane@example.com</p>
          </div>
          <form class="profile-form">
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
            <input type="email" placeholder="Email" />
          </form>
          <div class="profile-buttons">
            <button class="primary">Save</button>
            <button class="secondary">Cancel</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const items = [
  { title: 'Item One', subtitle: 'Description for item one' },
  { title: 'Item Two', subtitle: 'Description for item two' },
  { title: 'Item Three', subtitle: 'Description for item three' },
  { title: 'Item Four', subtitle: 'Description for item four' }
];
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e90ff;
  color: #fff;
  padding: 0.5rem 1rem;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.hamburger {
  font-size: 1.5rem;
  cursor: pointer;
}
.user-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #fff;
  color: #1e90ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-area {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background-color: #f5f5f5;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.menu-item {
  background-color: #e0e0e0;
  padding: 0.5rem;
}

.content {
  flex: 1;
  display: flex;
  gap: 1rem;
  padding: 1rem;
  overflow: auto;
}

.item-list {
  flex: 2;
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.item-row {
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 0.5rem;
}
.avatar {
  width: 40px;
  height: 40px;
  background-color: #ccc;
  border-radius: 50%;
  margin-right: 1rem;
}
.item-text {
  flex: 1;
}
.item-action {
  background-color: #1e90ff;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
}

.profile-panel {
  flex: 1;
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
}
.profile-avatar {
  width: 80px;
  height: 80px;
  background-color: #ccc;
  border-radius: 50%;
  margin-bottom: 1rem;
}
.profile-text {
  text-align: center;
}
.profile-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.5rem;
  margin-top: 1rem;
}
.profile-form input {
  padding: 0.5rem;
  border: 1px solid #ccc;
}
.profile-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
.primary {
  background-color: #1e90ff;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
}
.secondary {
  background-color: #ccc;
  border: none;
  padding: 0.5rem 1rem;
}
</style>

