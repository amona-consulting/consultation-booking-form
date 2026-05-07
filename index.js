'use strict'
function toggleBooking(radio) {
      const fields = document.getElementById('bookingFields');
      const dateInput = document.getElementById('bookingDate');
      const timeSelect = document.getElementById('bookingTime');

      fields.classList.toggle('visible', radio.value === 'yes');
      dateInput.required = radio.value === 'yes';
      timeSelect.required = radio.value === 'yes';

      if (radio.value !== 'yes') {
        dateInput.value = '';
        timeSelect.innerHTML = '<option value="">Select a time</option>';
        timeSelect.disabled = true;
      } else {
        setBookingDateMin();
      }
    }

    const availableTimesByWeekday = {
      0: [],
      1: [],
      2: ['9:15 AM', '2:00 PM', '2:15 PM', '3:30 PM', '3:45 PM'],
      3: ['2:00 PM', '2:15 PM', '3:30 PM', '3:45 PM'],
      4: ['9:15 AM', '2:00 PM', '2:15 PM'],
      5: ['2:00 PM', '2:15 PM'],
      6: [],
    };

    function getTodayDateString() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    function parseSlotDate(dateValue, slot) {
      const [time, period] = slot.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let hour = hours % 12;
      if (period.toUpperCase() === 'PM') {
        hour += 12;
      }
      const [year, month, day] = dateValue.split('-').map(Number);
      return new Date(year, month - 1, day, hour, minutes, 0, 0);
    }

    function setBookingDateMin() {
      const dateInput = document.getElementById('bookingDate');
      const minDate = getTodayDateString();
      dateInput.min = minDate;
      if (dateInput.value && dateInput.value < minDate) {
        dateInput.value = minDate;
      }
    }

    function populateTimeOptions() {
      const dateInput = document.getElementById('bookingDate');
      const timeSelect = document.getElementById('bookingTime');
      const dateValue = dateInput.value;

      timeSelect.innerHTML = '<option value="">Select a time</option>';
      timeSelect.disabled = true;

      if (!dateValue) {
        return;
      }

      setBookingDateMin();
      const todayString = getTodayDateString();
      const weekday = new Date(dateValue).getDay();
      let slots = availableTimesByWeekday[weekday] || [];

      if (dateValue < todayString) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Selected date is in the past';
        timeSelect.appendChild(option);
        return;
      }

      if (dateValue === todayString) {
        const now = new Date();
        slots = slots.filter(slot => parseSlotDate(dateValue, slot) > now);
      }

      if (slots.length > 0) {
        slots.forEach(slot => {
          const option = document.createElement('option');
          option.value = slot;
          option.textContent = slot;
          timeSelect.appendChild(option);
        });
        timeSelect.disabled = false;
      } else {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = dateValue === todayString ? 'No remaining times today' : 'No available times for this day';
        timeSelect.appendChild(option);
        timeSelect.disabled = true;
      }
    }

    async function handleSubmit(e) {
      e.preventDefault();
      const btn = e.target.querySelector('.submit-btn');
      btn.textContent = 'Submitting…';
      btn.disabled = true;

      const form = e.target;

      const areas = [...form.querySelectorAll('input[name="area"]:checked')].map(cb => cb.value);

      const payload = {
        firstName:   form.firstName.value.trim(),
        company:     form.company.value.trim(),
        role:        form.role.value.trim(),
        lastName:    form.lastName.value.trim(),
        email:       form.email.value.trim(),
        phone:       form.phone.value.trim(),
        areas:       areas,
        situation:   form.situation.value.trim(),
        urgency:     form.urgency.value,
        referral:    form.referral.value.trim(),
        book:        form.book.value,
        bookingDate: form.bookingDate.value,
        bookingTime: form.bookingTime.value.trim(),
      };

      try {
        const res = await fetch('https://amonaconsulting001.app.n8n.cloud/webhook/5d0b459e-3729-45ba-a47c-6de6a410f0e0', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          btn.textContent = '✓ Submitted!';
          btn.style.background = '#3a9e6e';
          form.reset();
          document.getElementById('bookingFields').classList.remove('visible');
        } else {
          throw new Error('Server error');
        }
      } catch (err) {
        btn.textContent = 'Something went wrong — try again';
        btn.style.background = '#c0392b';
        btn.disabled = false;
      }
    }

    document.addEventListener('DOMContentLoaded', setBookingDateMin);
