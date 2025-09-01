<template>
  <dialog id="devices_info" class="modal modal-md">
    <div class="modal-box max-w-md">
      <p class="card-title mb-2">Info about devices instructions</p>
      <ul class="list-disc list-inside">
        <li>
          <span class="font-bold">Properties</span>
          <p>
            It will add a constant linked to a device property, so when it is executed it will give
            to that constant the actual value of that property.
          </p>
        </li>
        <li class="pt-1">
          <span class="font-bold">Actions</span>
          <p>Creates an instruction that when executed will execute an action of a device.</p>
        </li>
      </ul>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>Ok</button>
    </form>
  </dialog>

  <dialog id="operations_info" class="modal modal-md">
    <div class="modal-box max-w-md">
      <p class="card-title mb-2">Info about operation instructions</p>
      <ul class="list-disc list-inside">
        <li>
          <span class="font-bold">Create constant</span>
          <p>It will add a named constant to which can be assigned a value given a type.</p>
        </li>
        <li class="pt-1">
          <span class="font-bold">Wait</span>
          <p>It will stop the script execution for a specified amount of time when executed.</p>
        </li>
        <li class="pt-1">
          <span class="font-bold">Start task</span>
          <p>
            It will start another task when executed. The script that execute this instruction will
            block until the other task finishes.
          </p>
        </li>
        <li class="pt-1">
          <span class="font-bold">Send notification</span>
          <p>It will send a notification to a specified user.</p>
        </li>
      </ul>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>Ok</button>
    </form>
  </dialog>

  <dialog id="flow_info" class="modal modal-md">
    <div class="modal-box max-w-md">
      <p class="card-title mb-2">Info about control flow instructions</p>
      <ul class="list-inside list-disc">
        <li>
          <span class="font-bold">If</span>
          <p>
            It will execute the instructions in the <span class="italic">then</span> node if a
            condition is true.
          </p>
          <p>
            The condition needs two constants to be evaluated and an operator. The operator can be
            negated (e.g. 2 equal not 1 is true, 2 equal 1 is false).
          </p>
        </li>
        <li class="pt-1">
          <span class="font-bold">If-Else</span>
          <p>
            Like the If instruction but it allows instructions in the
            <span class="italic">else</span> node to be executed if the condition is false.
          </p>
        </li>
      </ul>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>Ok</button>
    </form>
  </dialog>
</template>
