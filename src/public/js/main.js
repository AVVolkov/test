const socket = io({ transports: ['websocket'], upgrade: false });

const addTr = (data) => {
  $('#tbody').prepend(`<tr id="${data.id}"></tr`);
};

const addThs = (data) => {
  let html = `<th scope="row">${data.id}</th><th scope="row">${data.name}</th>`;

  Object.keys(data).forEach((item) => {
    if (['id', 'name', 'createdAt', 'updatedAt'].includes(item)) {
      return;
    }

    let color;
    let spanStyle = `class="blend small-text ${item}"`;
    if (data[item] >= -1 && data[item] < 0) {
      color = `rgba(255, 140, 0, ${Math.abs(data[item])})`;
    } else if (data[item] === 0) {
      color = 'rgb(255, 255, 255)';
    } else {
      const value = Math.abs(data[item]);
      color = `rgba(0, 0, 0, ${value})`;
      spanStyle = `class="small-text ${item}" style="color:${value > 0.5 ? 'white' : 'black'}"`;
    }
    html += `<td style="background-color:${color}"><span ${spanStyle}>${data[item]}</span></td>`;
  });

  $(`#${data.id}`).append(html);
};

const addElement = (data) => {
  const item = $(`#${data.id}`);

  if (item.length) {
    item.empty();
    return addThs(data);
  }

  addTr(data);
  return addThs(data);
};

const calculateResult = (num, type) => {
  let reducer;
  let init = 0;
  switch (type) {
    case 'min':
      init = Number($($(`.p${num}`).get()[0]).text());
      reducer = (min, cur) => (Number($(cur).text()) < min ? Number($(cur).text()) : min);
      break;
    case 'max':
      init = Number($($(`.p${num}`).get()[0]).text());
      reducer = (max, cur) => (Number($(cur).text()) > max ? Number($(cur).text()) : max);
      break;
    case 'avg':
      reducer = (avg, cur, _, { length }) => avg + Number($(cur).text()) / length;
      break;
    default:
      reducer = (accumulator, cur) => accumulator + Number($(cur).text());
  }
  const result = $(`.p${num}`).get().reduce(reducer, init);
  $(`#p${num}res`).text(result);
};

const changeAggregation = (selectObject) => {
  const num = selectObject.id
    .replace('p', '')
    .replace('ag', '');

  calculateResult(num, selectObject.value);
};

const addResultRows = () => {
  $('.result-td').get().forEach((item) => {
    const num = item.id
      .replace('p', '')
      .replace('res', '');
    calculateResult(num, $(`#p${num}ag`).val());
  });
};

socket.on('connect', () => {
  socket.on('set-list', (data) => {
    data.sort((a, b) => {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    });

    data.forEach((item) => {
      addElement(item);
    });
    addResultRows();
  });

  socket.on('upsert', (data) => {
    addElement(data);
    addResultRows();
  });

  socket.emit('get-list');
});
