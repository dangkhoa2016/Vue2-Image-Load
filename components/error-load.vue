<template>

  <div class='card mt-2 text-white bg-danger'>
    <div class='card-header'>
      Error
    </div>
    <div class='card-body'>
      {{ text }}
    </div>
  </div>

</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: () => { return 'Something wrong.'; }
      },
    },
  }
</script>
