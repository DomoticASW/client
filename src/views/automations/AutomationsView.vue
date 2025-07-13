<template>
  <ul class="list rounded-box">
    <li class="list-row">
      <div class="list-col-grow flex items-center">
        <div>Washing machine done</div>
      </div>
      <div class="flex items-center">
        <input type="checkbox" checked class="checkbox checkbox-sm" />
      </div>
    </li>

    <li class="list-row">
      <div class="list-col-grow flex items-center">
        <div>Turn off lights when high sun brightness</div>
      </div>
      <div class="flex items-center">
        <input type="checkbox" class="checkbox checkbox-sm" />
      </div>
    </li>
  </ul>

  <div class="flex justify-end px-4 pb-4 items-end">
    <button class="btn btn-circle btn-outline" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" class="size-[1.2em]" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  </div>
</template>

<style></style>
