
  // ---------- Registration form (Netlify Forms) ----------
  var registerForm = document.getElementById('registerForm');
  var formSuccess = document.getElementById('formSuccess');

  if (registerForm) {
    registerForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      // Формын мэдээллийг шалгах
      if (!registerForm.checkValidity()) {
        registerForm.reportValidity();
        return;
      }

      var submitButton = registerForm.querySelector(
        'button[type="submit"]'
      );

      var originalButtonText = submitButton
        ? submitButton.textContent
        : 'Бүртгэл илгээх';

      // Давхар илгээхээс хамгаалах
      if (submitButton) {
        if (submitButton.disabled) return;
        submitButton.disabled = true;
        submitButton.textContent = 'Илгээж байна...';
      }

      // Алдаа, төлөв харуулах хэсэг
      var statusMessage = registerForm.querySelector('.form-status');

      if (!statusMessage) {
        statusMessage = document.createElement('p');
        statusMessage.className = 'form-status';
        statusMessage.setAttribute('role', 'status');
        statusMessage.setAttribute('aria-live', 'polite');
        registerForm.appendChild(statusMessage);
      }

      statusMessage.textContent = '';
      statusMessage.style.color = '';

      try {
        // Netlify формын нэрийг шалгах
        var formName = registerForm.getAttribute('name');

        if (!formName) {
          throw new Error(
            'Формын name тохиргоо алга. name="registration" гэж тохируулна уу.'
          );
        }

        // Бүх талбарын мэдээллийг бэлтгэх
        var formData = new FormData(registerForm);

        // Netlify-д формын нэрийг заавал илгээнэ
        formData.set('form-name', formName);

        // Netlify Forms-д тохирох URL-encoded өгөгдөл
        var encodedData = new URLSearchParams();

        formData.forEach(function (value, key) {
          if (typeof value === 'string') {
            encodedData.append(key, value);
          }
        });

        // Netlify руу POST хүсэлт илгээх
        var response = await fetch('/', {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: encodedData.toString()
        });

        // Серверийн алдааг шалгах
        if (!response.ok) {
          throw new Error(
            'Netlify серверээс HTTP ' +
            response.status +
            ' алдаа ирлээ.'
          );
        }

        // Амжилттай илгээгдсэн
        console.log(
          'Форм илгээх хүсэлт амжилттай:',
          formName,
          response.status
        );

        if (formSuccess) {
          registerForm.hidden = true;
          formSuccess.classList.add('visible');
          formSuccess.hidden = false;
          formSuccess.focus();
        } else {
          statusMessage.textContent =
            'Таны бүртгэлийг илгээх хүсэлт амжилттай боллоо.';
          statusMessage.style.color = 'green';
        }

      } catch (error) {
        // Алдааны мэдээллийг хэрэглэгчид харуулах
        console.error('Netlify Forms алдаа:', error);

        var errorText = error.message || 'Тодорхойгүй алдаа гарлаа.';

        statusMessage.textContent =
          'Бүртгэл илгээж чадсангүй. ' +
          errorText +
          ' Дахин оролдоно уу.';

        statusMessage.style.color = 'red';

      } finally {
        // Алдаа гарсан тохиолдолд дахин илгээх боломж олгоно
        if (submitButton && !registerForm.hidden) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  }
