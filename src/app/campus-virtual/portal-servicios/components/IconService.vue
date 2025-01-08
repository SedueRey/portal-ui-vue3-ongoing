<script lang="ts">
  import { computed, defineComponent } from 'vue';

  export default defineComponent({
    name: 'IconService',
    props: {
      logo: { type: String, required: true },
    },
    setup(props) {
      // Creo el computado desde la prop
      const logoClass = computed(() =>
        props.logo ? `fad ${props.logo.replace(/(fa[aslrb])/gi, '')}` : '',
      );

      // Devuelvo los valores que se usarán en el template
      return {
        logoClass,
      };
    },
  });
</script>

<template>
  <i role="presentation" :class="logoClass" />
</template>
