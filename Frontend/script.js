<script>

  const results = document.getElementById("results");
  const cloud = document.getElementById("cloud");
  const onprem = document.getElementById("onpremise");
  const loading = document.getElementById("loader");
  let lastTotal = 0;
  
  function drawResults(data){
    if(!data){return;}
    const total = (data.cloud || 0) + (data.onpremise || 0);
    const style = document.createElement('style');
    let styles="";
    for(var i=lastTotal;i<total;i++){
      styles = styles + 'bar[data-value][data-value="'+i+'"] {height: calc(100% / '+(total)+' * '+i+');min-height:6%;}';
    }
    if(total>0){
      styles = styles + 'bar[data-value][data-value="'+total+'"] {height: 100%;}';
    }
    lastTotal = i;
    style.innerHTML = styles;
    document.body.appendChild(style);
    cloud.setAttribute("data-value", data.cloud || 0);
    cloud.setAttribute("data-tip", data.cloud || 0);
    cloud.innerHTML = data.cloud || 0;
    onpremise.setAttribute("data-value", data.onpremise || 0);
    onpremise.setAttribute("data-tip", data.onpremise || 0);
    onpremise.innerHTML = data.onpremise || 0;
    loading.style.display = "none";
  }      
  
  document.querySelectorAll('input').forEach(item => {
    item.addEventListener("click", function(){
      loading.style.display = "block";
      google.script.run.withSuccessHandler(drawResults).addVote(document.querySelector('input[name="cpd"]:checked').value);
    });
  });
  
  google.script.run.withSuccessHandler(function(data){
    if(data){
      document.querySelector('input[value="'+data+'"]').checked=true;
    }
    google.script.run.withSuccessHandler(drawResults).getData();
  }).getUserVote();
  
  function refresh(){
    setTimeout(() => {
      google.script.run.withSuccessHandler(drawResults).getData();
      refresh();
    }, 10000);
  }
  
  refresh();
</script>
