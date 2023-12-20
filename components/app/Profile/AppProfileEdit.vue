<template>
  <v-dialog persistent width="585" :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)">
    <v-card :disabled="loading">
      <v-card variant="text">
        <v-img cover :src="cover" height="127" class="d-flex align-center text-center">
          <div>
            <v-btn icon="mdi-camera" @click.stop="coverUploader?.click()" variant="plain"></v-btn>
            <v-btn icon="mdi-close" @click.stop="removeCover" variant="plain"></v-btn>
          </div>
        </v-img>

        <div class="d-flex justify-space-between mx-4">
          <v-avatar v-if="!avatar" color="surface-variant" size="86" class="profile-avatar">
            <v-btn icon="mdi-camera" @click.stop="avatarUploader?.click()" variant="plain"></v-btn>
          </v-avatar>

          <v-avatar v-else-if="newValues.avatar || avatar" size="86" class="profile-avatar">
            <v-img :src="avatar" height="86" width="86" class="align-center">
              <v-btn icon="mdi-camera" @click.stop="avatarUploader?.click()" variant="plain"></v-btn>
            </v-img>
          </v-avatar>
        </div>
      </v-card>
      <v-card-text>
        <v-text-field v-model="username" label="Username" hide-details variant="outlined"></v-text-field>
      </v-card-text>
      <v-card-text v-if="errorMessage !== ''">
        <v-alert variant="outlined" type="error">
          {{ errorMessage }}
        </v-alert>
      </v-card-text>
      <v-card-actions class="justify-center px-6 py-3">
        <v-spacer></v-spacer>
        <v-btn class="w-25 pt-1" rounded="pill" color="grey-lighten-1" variant="text" @click.stop="handleClose">
          Cancel
        </v-btn>
        <v-btn :loading="loading" class="w-25 pt-1" rounded="pill" color="primary" variant="flat"
          @click.stop="handleEditProfile">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
    <AppProfileEditDiscard v-model="discardAlert" @discard-changes="onDiscardChanges" />
    <input ref="avatarUploader" accept="image/*" class="d-none" type="file" @change="avatarUpload">
    <input ref="coverUploader" accept="image/*" class="d-none" type="file" @change="coverUpload">
  </v-dialog>
</template>

<script lang="ts" setup>
import defaultCover from "~/assets/images/default-cover.png";

const discardAlert = ref(false);
const avatarUploader = ref<HTMLInputElement>();
const loading = ref(false);

const coverUploader = ref<HTMLInputElement>();

const errorMessage = ref("");

const avatar = computed(() => {
  if (newValues.avatar) return newValues.avatar
  return props.avatar
})

const cover = computed(() => {
  if (newValues.cover) return newValues.cover
  return props.cover
})

const newValues = reactive<{
  cover?: string | null;
  avatar?: string | null;
  username?: string;
}>({});

const resetState = () => {
  newValues.avatar = undefined
  newValues.cover = undefined
  newValues.username = undefined
  errorMessage.value = ''
}

interface Props {
  modelValue: boolean;
  cover?: string;
  avatar?: string;
  username?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  cover: defaultCover,
  avatar: undefined,
  username: undefined,
});

const hasChanges = computed(() => {
  return newValues.avatar !== undefined || newValues.cover !== undefined || newValues.username !== undefined
})

const username = computed({
  get() {
    return newValues.username || props.username
  },
  set(value) {
    if (value !== null && value !== undefined && value.length > 0) newValues.username = value
  }
})

const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const handleClose = () => {
  if (hasChanges.value) {
    discardAlert.value = true;
  } else {
    emits("update:modelValue", false);
  }
};

const onDiscardChanges = (value: boolean) => {
  if (value) {
    emits("update:modelValue", false);
    resetState();
  }
};

interface ImageValidator {
  maxFileSize: number;
  formatsAllowed: string[];
  minWidth: number;
  minHeight: number;
  square: boolean;
}

const validateImage = (file: File, opts: ImageValidator) => {
  const { maxFileSize, formatsAllowed, minWidth, minHeight } = opts;

  const reader = new FileReader();
  reader.readAsDataURL(file);

  return new Promise((resolve, reject) => {
    if (file.size > maxFileSize) {
      reject(`Image must be less than ${maxFileSize / 1024 / 1024}MB`);
    }

    if (!formatsAllowed.includes(file.type)) {
      reject(`Image must be of type ${formatsAllowed.join(", ")}`);
    }

    reader.onload = (e) => {
      if (!e.target) {
        return;
      }

      const image = new Image();
      image.onload = () => {
        if (image.height && image.height < minHeight) {
          reject(`Image must be at least ${minHeight}px x ${minWidth}px`);
        }

        if (image.width && image.width < minWidth) {
          reject(`Image must be at least ${minHeight}px x ${minWidth}px`);
        }

        if (opts.square && image.height !== image.width) {
          reject("Image must be square");
        }

        resolve(true);
      };

      image.onerror = () => {
        reject(false);
      };

      image.src = e.target?.result as string;
    };
  });
};

const avatarUpload = async () => {
  errorMessage.value = ''

  const file = toValue(avatarUploader)?.files?.[0]
  if (!file) {
    return
  }

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = (e) => {
    if (!e.target) {
      return
    }

    validateImage(file, {
      maxFileSize: 10 * 1024 * 1024,
      formatsAllowed: ["image/jpeg", "image/png"],
      minWidth: 250,
      minHeight: 250,
      square: true,
    }).then(() => {
      newValues.avatar = e.target?.result as string
    }).catch((e) => {
      newValues.avatar = undefined
      errorMessage.value = e
    })
  }
}

const coverUpload = async () => {
  errorMessage.value = ''

  const file = toValue(coverUploader)?.files?.[0]
  if (!file) {
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    if (!e.target) {
      return
    }

    validateImage(file, {
      maxFileSize: 10 * 1024 * 1024,
      formatsAllowed: ["image/jpeg", "image/png"],
      minWidth: 1374,
      minHeight: 300,
      square: false,
    }).then(() => {
      newValues.cover = e.target?.result as string
    }).catch((e) => {
      newValues.cover = undefined
      errorMessage.value = e
    })
  }
  reader.readAsDataURL(file)
}

const removeCover = async () => {
  newValues.cover = null
}

function base64ToFile(base64String: string, filename: string): File {
  const splitData = base64String.split(',');
  const contentType = splitData[0].split(':')[1].split(';')[0];
  const base64 = splitData[1];
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: contentType });
  return new File([blob], filename, { type: contentType });
}

const handleEditProfile = async () => {
  if (!hasChanges.value) {
    emits("update:modelValue", false);
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const avatar = toValue(newValues.avatar)
    const cover = toValue(newValues.cover)
    const usernameVal = toValue(username)

    const formData = new FormData()
    if (avatar !== undefined) {
      if (avatar === null) {
        formData.append('avatar', '')
      } else {
        formData.append('avatar', avatar ? base64ToFile(avatar, 'avatar') : '')
      }
    }

    if (cover !== undefined) {
      if (cover === null) {
        formData.append('cover', '')
      } else {
        formData.append('cover', cover ? base64ToFile(cover, 'cover') : '')
      }
    }

    if (usernameVal) formData.append('username', usernameVal)

    const data = await $fetch('/api/me', {
      method: 'PUT',
      body: formData
    })

    const user = useUserState();
    user.value = data.user

    emits("update:modelValue", false);
    resetState();
  } catch (e) {
    // @ts-ignore
    errorMessage.value = e.data.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-avatar {
  margin-top: -43px;
  border: 2px solid white;
}
</style>