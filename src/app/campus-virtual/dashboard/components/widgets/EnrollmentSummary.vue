<template>
  <article class="enrollmentSummary">
    <header>
      <h1>Grado en Biología</h1>
      <span>2022/2023</span>
    </header>
    <ul class="details">
      <li>
        <strong>
          Total créditos
          <span class="dashboard__number">240</span> </strong
        >:
        <span class="dashboard__number">60</span>
        créditos de asignaturas de formación básica,
        <span class="dashboard__number">144</span>
        créditos de asignaturas obligatorias,
        <span class="dashboard__number">24</span>
        de optativas,
        <span class="dashboard__number">0</span>
        prácticas y
        <span class="dashboard__number">12</span>
        créditos del trabajo fin de grado.
      </li>
      <li>
        <strong>Créditos superados <span class="dashboard__number">54</span> </strong>:
        <span class="dashboard__number">48</span>
        de formación básica
        <span class="dashboard__number">6</span>
        de asignaturas obligatorias.
      </li>
      <li>
        <strong>
          Créditos matriculados
          <span class="dashboard__number">60</span> </strong
        >:
        <span class="dashboard__number">54</span>
        de asignaturas de segundo y
        <span class="dashboard__number">6</span>
        de primero.
      </li>
    </ul>
  </article>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'EnrollmentSummary',
  });
</script>

<style lang="scss">
  @container dashboardwidget (max-width: 500px) {
    .enrollmentSummary {
      ul.details {
        padding: 0 0 0 1rem;
        li {
          margin-bottom: 0 0 0.5rem 0;
        }
      }
    }
  }
</style>
