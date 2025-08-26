<template>
  <dialog id="devices_info" class="modal modal-md">
    <div class="modal-box max-w-md">
      <h3 class="card-title mb-2">Info about devices instructions</h3>
      <p class="font-bold">- Properties</p>
      <p>
        It will add a constant linked to a device property, so when it is executed it will give to
        that constant the actual value of that property.
      </p>
      <p class="font-bold pt-1">- Actions</p>
      <p>Creates an instruction that when executed will execute an action of a device.</p>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>Ok</button>
    </form>
  </dialog>

  <dialog id="operations_info" class="modal modal-md">
    <div class="modal-box max-w-md">
      <h3 class="card-title mb-2">Info about operation instructions</h3>
      <p class="font-bold">- Create constant</p>
      <p>It will add a named constant to which can be assigned a value given a type.</p>
      <p class="font-bold pt-1">- Wait</p>
      <p>It will stop the script execution for a specified amount of time when executed.</p>
      <p class="font-bold pt-1">- Start task</p>
      <p>
        It will start another task when executed. The script that execute this instruction will
        block until the other task finishes.
      </p>
      <p class="font-bold pt-1">- Send notification</p>
      <p>It will send a notification to a specified user.</p>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>Ok</button>
    </form>
  </dialog>

  <dialog id="flow_info" class="modal modal-md">
    <div class="modal-box max-w-md">
      <h3 class="card-title mb-2">Info about control flow instructions</h3>
      <p class="font-bold">- If</p>
      <p>
        It will execute the instructions in the <span class="italic">then</span> node if a condition
        is true.
      </p>
      <p>
        The condition needs two constants to be evaluated and an operator. The operator can be
        negated (e.g. 2 equal not 1 is true, 2 equal 1 is false).
      </p>
      <p class="font-bold pt-1">- If-Else</p>
      <p>
        Like the If instruction but it allows instructions in the
        <span class="italic">else</span> node to be executed if the condition is false.
      </p>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>Ok</button>
    </form>
  </dialog>
</template>
