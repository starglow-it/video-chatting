#!bin/bash
source ../deploy/local/.env
echo "Stripe Api Key: $STRIPE_API_KEY"
stripe listen --api-key $STRIPE_API_KEY --forward-to localhost:5050/payments/$1

: '
    - Exemple command:
   + Stripe Account: bash stripe-listen-local.sh webhook
   + Stripe connect: bash stripe-listen-local.sh express-webhook
'
