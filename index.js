'use strict'
function toggleBooking(radio) {
      const fields = document.getElementById('bookingFields');
      fields.classList.toggle('visible', radio.value === 'yes');
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
        const res = await fetch('https://amonaconsulting000.app.n8n.cloud/webhook/5d0b459e-3729-45ba-a47c-6de6a410f0e0', {
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