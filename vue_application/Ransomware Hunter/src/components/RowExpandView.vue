<template>
    <div class="card">
        <p><strong>ID :</strong> {{ row[0] }}</p>
        <p><strong>Source IP :</strong> {{ row[1] }}</p>
        <p><strong>Destination IP :</strong> {{ row[2] }}</p>
        <p><strong>Total Connections :</strong> {{ row[3] }}</p>
        <p><strong>Score :</strong> {{ row[4] }}</p>
        <p><strong>Skew Score :</strong> {{ row[5] }}</p>
        <p><strong>MAD Score :</strong> {{ row[6] }}</p>
        <p><strong>Count Score :</strong> {{ row[7] }}</p>
        <p><strong>Image :</strong> {{ row[8] }}</p>
        <p><strong>Computer :</strong> {{ row[9] }}</p>
        <p><strong>Command Line :</strong> {{ row[10] }}</p>
        <p><strong>Process Id:</strong> {{ row[11] }}</p>
    </div>
    <button @click="backButton()">Close</button>
</template>

  <style>
    .card {
      border: 1px solid #ccc;
      padding: 10px;
      border-radius: 5px;
      width: 95vw;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  </style>
  
<script>
export default {
    props: {
        row: {
        type: Array,
        required: true, // The row data must be passed
        },
    },
    emits: ['closeView'],
    methods: {
        backButton() {
        this.$emit('closeView'); // Emit an event named 'closeView' when the button is clicked
        },
    },
};
</script>
