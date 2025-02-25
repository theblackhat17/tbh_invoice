#!/usr/bin/env bash

echo "======================================="
echo "  TBH Invoice - Script d'éxecution  "
echo "======================================="
echo
echo "Que souhaites-tu faire ?"
echo "1) Lancer le site de Facturation by TBH"
echo
read -p "Choix : " CHOICE

if [ "$CHOICE" = "1" ]; then
  echo
  echo "Lancement en mode dev..."
  npm run dev

else
  echo "Choix invalide. Bye."
fi
