<template>

  <div class='card'>
    <div class='card-header'>
      Image information
    </div>
    <ul class='list-group list-group-flush'>
      <li class='list-group-item'>Width: <label class='badge bg-info'>{{ width }} px</label></li>
      <li class='list-group-item'>Height: <label class='badge bg-warning'>{{ height }} px</label></li>
      <li class='list-group-item'>Size: <label class='badge bg-success'>{{ $formatSize(size) }}</label></li>
    </ul>
  </div>

</template>

<script>
  export default {
    props: {
      width: {
        type: Number,
        default: 0
      },
      height: {
        type: Number,
        default: 0
      },
      size: {
        type: Number,
        default: 0
      },
    },
  }
</script>
