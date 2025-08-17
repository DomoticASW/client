<template>
  <NavbarLayout title="Settings" :show-logout-button="true">

    <form @submit.prevent="handleSave" class="w-full px-6">
      <div class="form-control">
        <span class="label-text">Nickname</span>
        <label class="input validator w-full">
          <i class="fa-regular fa-user opacity-50"></i>
          <input 
            v-model="form.nickname" 
            type="text" 
            placeholder="Your nickname" 
            :class="{ 'input-error': v$.nickname.$error }"
            @blur="v$.nickname.$touch()"
          />
        </label>
        <div class="min-h-[1.5rem]">
          <label class="label py-0" v-if="v$.nickname.$error">
            <span class="label-text-alt text-error">
              {{ v$.nickname.$errors[0].$message }}
            </span>
          </label>
        </div>
      </div>
      
      <div class="form-control">
        <span class="label-text">Email</span><br>
        <label class="input validator w-full opacity-50">
          <i class="fa-regular fa-envelope"></i>
          <input 
            v-model="form.email" 
            type="email" 
            placeholder="your@email.com" 
            readonly
            :class="{ 'input-error': v$.email.$error }"
            @blur="v$.email.$touch()"
          />
        </label>
          <div class="min-h-[1.5rem]">
          <label class="label py-0" v-if="v$.email.$error">
            <span class="label-text-alt text-error">
              {{ v$.email.$errors[0].$message }}
            </span>
          </label>
        </div>
      </div>
      
      <div class="form-control">
        <span class="label-text">New password</span>
        <div class="relative">
          <label class="input validator w-full">
            <i class="fa-solid fa-key opacity-50"></i>
            <input 
              v-model="form.password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="••••••••" 
              :class="{ 'input-error': v$.password.$error }"
              @blur="v$.password.$touch()"
            />
            <button 
              type="button" 
              class="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-gray-500 hover:text-gray-700"
              @click="showPassword = !showPassword"
            >
              <i 
                :class="showPassword ? 'fa-eye-slash' : 'fa-eye'" 
                class="fas"
              ></i>              
            </button>
          </label>
        </div>
        <div class="min-h-[1.5rem]">
          <label class="label py-0" v-if="v$.password.$error">
            <span class="label-text-alt text-error">
              {{ v$.password.$errors[0].$message }}
            </span>
          </label>
        </div>
      </div>
      
      <div class="form-control">
        <span class="label-text">Confirm new password</span>
        <div class="relative">
          <label class="input validator w-full">
            <i class="fa-solid fa-key opacity-50"></i>
            <input 
              v-model="form.confirmPassword" 
              :type="showConfirmPassword ? 'text' : 'password'" 
              placeholder="••••••••" 
              :class="{ 'input-error': v$.confirmPassword.$error }"
              @blur="v$.confirmPassword.$touch()"
            />
            <button 
                type="button" 
                class="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-gray-500 hover:text-gray-700"
                @click="showConfirmPassword = !showConfirmPassword"
              >
              <i 
                :class="showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'" 
                class="fas"
              ></i>              
            </button>
          </label>
        </div>
        <div class="min-h-[1.5rem]">
          <label class="label py-0" v-if="v$.confirmPassword.$error">
            <span class="label-text-alt text-error">
              {{ v$.confirmPassword.$errors[0].$message }}
            </span>
          </label>
        </div>
      </div>
      
      <div class="flex justify-center">
        <div class="form-control mt-6">
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="!hasChanges || v$.$invalid"
            :class="{ 'btn-disabled': !hasChanges || v$.$invalid }"
            >
            Save
          </button>
        </div>
      </div>
    </form>
  </NavbarLayout>
</template>

<script setup lang="ts">
import { reactive, computed, ref, watch, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, sameAs, helpers } from '@vuelidate/validators';
import { useUserInfoStore } from '@/stores/user-info';
import * as api from '@/api/users-management/requests/users';
import { useLoadingOverlayStore } from '@/stores/loading-overlay';
import NavbarLayout from '@/components/NavbarLayout.vue'
import { presentSuccess, useSuccessPresenterStore } from '@/stores/success-presenter'

type SettingsForm = {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const loadingOverlay = useLoadingOverlayStore()
const successPresenter = useSuccessPresenterStore();

const userInfoStore = useUserInfoStore();
const userNickname = ref(userInfoStore.nickname);
const userEmail = ref(userInfoStore.email);

onMounted(() => {
  userNickname.value = userInfoStore.nickname;
  userEmail.value = userInfoStore.email;
});

const initialForm = reactive<SettingsForm>({
  nickname: userNickname.value,
  email: userEmail.value,
  password: '',
  confirmPassword: ''
});

const form = reactive<SettingsForm>({ ...initialForm });
const hasChanges = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const password = computed(() => form.password);

watch(form, (newValue) => {
  hasChanges.value = Object.keys(initialForm).some(
  key => newValue[key as keyof SettingsForm] !== initialForm[key as keyof SettingsForm]
  );
}, { deep: true });

const rules = {
  nickname: { required: helpers.withMessage('Nickname is required', required) },
  email: { required: helpers.withMessage('Email is required', required), email: helpers.withMessage('Email must be valid', email) },
  password: { 
    minLength: helpers.withMessage('Password must be at least 6 characters', minLength(6)),
},
  confirmPassword: { sameAsPassword: helpers.withMessage('Passwords must match', sameAs(password)) }
};

const v$ = useVuelidate(rules, form);

const handleSave = async (): Promise<void> => {
  v$.value.$touch();
  if (v$.value.$invalid) return;

  const body: Record<string, string> = {};

  const userInfoStore = useUserInfoStore();

  if (form.nickname != userInfoStore.nickname) {
    body.nickname = form.nickname;
  }

  if (form.password) {
    body.password = form.password;
  }

  try {
    loadingOverlay.startLoading();
    await api.updateUser(userInfoStore.token, body);
    userInfoStore.setNickname(form.nickname);
    successPresenter.showSuccess(presentSuccess('Settings saved successfully', '', 5000));
    initialForm.nickname = form.nickname;
    initialForm.password = '';
    initialForm.confirmPassword = '';
    form.password = '';
    form.confirmPassword = '';
    hasChanges.value = false;
  } finally {
    loadingOverlay.stopLoading();
  }
}
</script>
