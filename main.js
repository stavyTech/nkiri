// REFERER CODE GENERATOR/////
const accountType = document.getElementById('accountType');
const referralBox = document.getElementById('referralBox');
const referralCode = document.getElementById('referralCode');

function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'SP-';

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

accountType.addEventListener('change', function () {
  if (this.value === 'service-provider') {
        referralCode.value = '';
  }
});

// BLOGG SEARCH FUNCTIONALITY///////

const searchInput = document.getElementById('blogSearch');
const blogCards = document.querySelectorAll('.blog-card');

searchInput.addEventListener('keyup', function () {
  const value = this.value.toLowerCase();

  blogCards.forEach(card => {
    const text = card.textContent.toLowerCase();

    if (text.includes(value)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});

// LIVE CHAT INTEGRATION/////
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/default';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();

// PAYSTACK PAYMENT INTEGRATION/////
{/* <script src="https://js.paystack.co/v1/inline.js"></script>

<button class="btn btn-primary" onclick="payWithPaystack()">
  Make Payment
</button> */}
function payWithPaystack() {
  let handler = PaystackPop.setup({
    key: 'YOUR_PAYSTACK_PUBLIC_KEY',
    email: 'customer@email.com',
    amount: 500000,
    currency: 'NGN',

    callback: function(response) {
      alert('Payment successful. Reference: ' + response.reference);
    },

    onClose: function() {
      alert('Transaction cancelled');
    }
      
  });

  handler.openIframe();
}