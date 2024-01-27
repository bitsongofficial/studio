<template>
  <v-container class="pa-1">
    <v-row class="pt-1">
      <v-col>
        <v-select variant="outlined" :items="trackGenres" label="Genre" append-inner-icon="mdi-menu-down"
          v-model="modelValue.genre"></v-select>
      </v-col>
      <v-col>
        <v-select variant="outlined" :items="countries" label="Country" append-inner-icon="mdi-menu-down"
          v-model="modelValue.country"></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-select variant="outlined" :items="licenses" label="License" append-inner-icon="mdi-menu-down"
          v-model="modelValue.license"></v-select>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="8">
        <v-card-title class="px-0">Preview Start Time</v-card-title>
        <v-card-subtitle class="px-0">Indicate the start time of the preview of your track.</v-card-subtitle>
      </v-col>
      <v-col cols="2">
        <v-text-field v-model="modelValue.previewStartTime" class="mt-2" placeholder="0s" variant="outlined">
          <template #append-inner>sec</template>
        </v-text-field>
      </v-col>
    </v-row>

    <v-row no-gutters class="mt-n2">
      <v-col cols="8">
        <v-card-title class="px-0">Preview Duration</v-card-title>
        <v-card-subtitle class="px-0">Indicate the duration of the preview of your track.</v-card-subtitle>
      </v-col>
      <v-col>
        <v-row>
          <v-col>
            <v-slider class="mt-5" :min="5" :max="30" :step="0.5" v-model="modelValue.previewDuration"></v-slider>
          </v-col>
          <v-col>
            <div class="mt-6">{{ modelValue.previewDuration > 5 ? modelValue.previewDuration : 5 }} sec</div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="8">
        <v-card-title class="px-0">Explicit</v-card-title>
        <v-card-subtitle class="px-0">If this track contains explicit content</v-card-subtitle>
      </v-col>
      <v-col>
        <v-switch v-model="modelValue.explicit" color="primary"></v-switch>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="8">
        <v-card-title class="px-0">Live Recording</v-card-title>
        <v-card-subtitle class="px-0">If this is a live recording, please check this box.</v-card-subtitle>
      </v-col>
      <v-col>
        <v-switch v-model="modelValue.liveRecording" color="primary"></v-switch>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="8">
        <v-card-title class="px-0">Previously Released</v-card-title>
        <v-card-subtitle class="px-0">If this track has been previously released, please check this box.</v-card-subtitle>
      </v-col>
      <v-col>
        <v-switch v-model="modelValue.previousRelease" color="primary"></v-switch>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="text-right">
        <v-btn @click="onDone">Continue</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
export interface TrackInfoAdditionalData {
  genre: string;
  country: string;
  license: string;
  explicit: boolean;
  liveRecording: boolean;
  previousRelease: boolean;
  previewStartTime: number;
  previewDuration: number;
}

const emits = defineEmits<{
  'update:modelValue': [payload: TrackInfoAdditionalData];
  "done": [];
}>()

const props = defineProps<{ modelValue: TrackInfoAdditionalData }>();
const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
})

function onDone() {
  emits("done");
}

const trackGenres = [
  "Hip Hop",
  "Rap",
  "Trap",
  "R&B",
  "Pop",
  "Rock",
  "Alternative",
  "Country",
  "Electronic",
  "Dance",
  "Reggae",
  "Reggaeton",
  "Latin",
  "Soul",
  "Funk",
  "Jazz",
  "Blues",
  "Classical",
  "Soundtrack",
  "World",
  "Audiobook",
  "Comedy",
  "Children's Music",
  "Holiday",
  "Other",
];

const countries = [
  "United States",
  "United Kingdom",
  "Afghanistan",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua And Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas The",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Channel Islands",
  "Chile",
  "China",
  "China (Hong Kong S.A.R.)",
  "China (Macau S.A.R.)",
  "Christmas Island",
  "Cocos (Keeling) Islands",
  "Colombia",
  "Comoros",
  "Congo",
  "Congo Democractic Republic of",
  "Cook Islands",
  "Costa Rica",
  "Cote D'Ivoire (Ivory Coast)",
  "Croatia (Hrvatska)",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Falkland Islands (Islas Malvinas)",
  "Faroe Islands",
  "Fiji Islands",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "French Southern Territories",
];

const licenses = [
  "All Rights Reserved",
  "CC BY",
  "CC BY-NC",
  "CC BY-NC-ND",
  "CC BY-NC-SA",
  "CC BY-ND",
  "CC BY-SA",
  "CC0",
  "Public Domain",
  "Other",
];
</script>
