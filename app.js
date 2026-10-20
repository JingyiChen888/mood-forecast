const forecasts = {
  'quiet-low': {
    title: 'Cloudy', weather: 'overcast', preview: 'A quiet sky moving at its own pace.',
    report: 'Your thoughts are calm, and your energy is moving slowly. This sky has room to take its time.'
  },
  'quiet-steady': {
    title: 'Partly Cloudy', weather: 'partly', preview: 'A little light is finding its way through.',
    report: 'There is space to think and enough energy to keep going. The clouds are only passing through.'
  },
  'quiet-full': {
    title: 'Clear Skies', weather: 'sun', preview: 'Bright, open, and ready to move.',
    report: 'Your mind feels quiet and your energy is here. Enjoy the clear patch while it lasts.'
  },
  'busy-low': {
    title: 'Morning Mist', weather: 'fog', preview: 'The view is soft around the edges.',
    report: 'A few thoughts are drifting around while your energy is low. The view can stay soft for now.'
  },
  'busy-steady': {
    title: 'Breezy', weather: 'wind', preview: 'A few thoughts are moving through.',
    report: 'Your mind has some movement, and you have some energy to meet it. Let the breeze pass through.'
  },
  'busy-full': {
    title: 'Windy Sunshine', weather: 'wind', preview: 'Bright skies with plenty in motion.',
    report: 'There is a lot going on, and plenty of energy behind it. The sun is still visible through the wind.'
  },
  'loud-low': {
    title: 'Thick Fog', weather: 'fog', preview: 'Visibility is low; you can slow down.',
    report: 'Your mind is loud while your energy is running low. You do not have to see the whole horizon today.'
  },
  'loud-steady': {
    title: 'Rain Showers', weather: 'rain', preview: 'A busy sky, with breaks between showers.',
    report: 'There is plenty of noise, with just enough energy to move through it. The rain comes in waves.'
  },
  'loud-full': {
    title: 'Thunderstorm', weather: 'storm', preview: 'A big, electric sky.',
    report: 'Your mind is loud and your energy is high. There is a lot happening in this sky at once.'
  }
};

const form = document.querySelector('#forecast-form');
const sky = document.querySelector('#sky');
const title = document.querySelector('#weather-title');
const description = document.querySelector('#weather-description');
const hint = document.querySelector('#weather-hint');
const status = document.querySelector('#form-status');
const card = document.querySelector('#forecast-card');
const cardTitle = document.querySelector('#forecast-card-title');
const cardCopy = document.querySelector('#forecast-card-copy');
const cardConditions = document.querySelector('#forecast-card-conditions');
const editButton = document.querySelector('#edit-button');

let publishedKey = null;

function selectedValue(name) {
  return form.querySelector(`input[name="${name}"]:checked`)?.value ?? null;
}

function clearError(name) {
  document.querySelector(`#${name}-group`).classList.remove('has-error');
  document.querySelector(`#${name}-error`).textContent = '';
  form.querySelectorAll(`input[name="${name}"]`).forEach((input) => input.removeAttribute('aria-invalid'));
}

function showError(name, message) {
  document.querySelector(`#${name}-group`).classList.add('has-error');
  document.querySelector(`#${name}-error`).textContent = message;
  form.querySelectorAll(`input[name="${name}"]`).forEach((input) => input.setAttribute('aria-invalid', 'true'));
}

function renderPreview() {
  const noise = selectedValue('noise');
  const energy = selectedValue('energy');
  sky.dataset.noise = noise ?? 'none';
  sky.dataset.energy = energy ?? 'none';

  if (noise && energy) {
    const forecast = forecasts[`${noise}-${energy}`];
    sky.dataset.weather = forecast.weather;
    title.textContent = forecast.title;
    description.textContent = forecast.preview;
    hint.textContent = 'Change either answer to explore another sky, or publish this forecast.';
    status.textContent = 'Your sky is ready. You can keep adjusting it or publish it.';
  } else if (noise || energy) {
    sky.dataset.weather = 'forming';
    title.textContent = 'Your sky is taking shape';
    description.textContent = noise
      ? 'Choose your energy to complete the forecast.'
      : 'Choose how busy your mind is to complete the forecast.';
    hint.textContent = 'Every choice changes the sky. Try the other observation next.';
    status.textContent = 'One observation down. Choose the other to see your forecast.';
  } else {
    sky.dataset.weather = 'waiting';
    title.textContent = 'Waiting for your weather';
    description.textContent = 'Pick an answer and watch the sky respond.';
    hint.textContent = 'You can change either answer to see a different forecast.';
    status.textContent = 'Choose an answer above to start changing the sky.';
  }
}

form.addEventListener('change', (event) => {
  if (!event.target.matches('input[type="radio"]')) return;
  clearError(event.target.name);
  publishedKey = null;
  card.hidden = true;
  renderPreview();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const noise = selectedValue('noise');
  const energy = selectedValue('energy');

  clearError('noise');
  clearError('energy');
  if (!noise || !energy) {
    if (!noise) showError('noise', 'Choose how busy your mind is.');
    if (!energy) showError('energy', 'Choose your current energy level.');
    status.textContent = 'Add the missing observation before publishing.';
    form.querySelector(`input[name="${!noise ? 'noise' : 'energy'}"]`).focus();
    return;
  }

  const key = `${noise}-${energy}`;
  if (publishedKey === key && !card.hidden) {
    status.textContent = 'This forecast is already published. Change an answer to make a new one.';
    return;
  }

  const forecast = forecasts[key];
  cardTitle.textContent = forecast.title;
  cardCopy.textContent = forecast.report;
  cardConditions.textContent = `${noise} mind  ·  ${energy} energy`;
  card.hidden = false;
  publishedKey = key;
  status.textContent = 'Forecast published. You can adjust either answer and try again.';
  hint.textContent = 'Published. Change an answer above, or use the card below to adjust your forecast.';
  cardTitle.setAttribute('tabindex', '-1');
  cardTitle.focus({ preventScroll: true });
  card.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
});

editButton.addEventListener('click', () => {
  card.hidden = true;
  publishedKey = null;
  renderPreview();
  status.textContent = 'Your answers are still here. Change either one to update the sky.';
  form.querySelector('input[name="noise"]:checked').focus({ preventScroll: true });
  form.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
});

renderPreview();
