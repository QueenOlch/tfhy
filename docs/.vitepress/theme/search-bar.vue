<template>
    <div class="search">
      <input
        type="text"
        v-model="query"
        placeholder="Search..."
        @input="performSearch"
      />
      <ul v-if="results.length">
        <li v-for="result in results" :key="result">
          <a :href="result">{{ result }}</a>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { search } from '../../scripts/search.js';
  
  export default {
    data() {
      return {
        query: '',
        results: [],
      };
    },
    methods: {
      async performSearch() {
        if (this.query.length > 2) {
          this.results = await search(this.query);
        } else {
          this.results = [];
        }
      },
    },
  };
  </script>
  
  <style>
  .search {
    position: relative;
  }
  
  .search input {
    width: 100%;
    padding: 0.5rem;
  }
  
  .search ul {
    list-style: none;
    padding: 0;
    margin: 0;
    background: rgb(248, 0, 0);
    border: 1px solid #ff0000;
  }
  
  .search li {
    padding: 0.5rem;
  }
  </style>
  