/*
=========================================================
GBSB AI Media Studio
Version : 0.1.0 Alpha
Module  : Dashboard Controller
Author  : Ajay Singh Chouhan
Organization : GBSB4U Publications
License : MIT
=========================================================
*/

"use strict";

/**
 * Dashboard Controller
 */
const Dashboard = {

    init() {

        this.bindCards();

        this.bindQuickActions();

        this.bindBottomNavigation();

        console.log("Dashboard Ready");

    },

    bindCards() {

        const cards = document.querySelectorAll(".dashboard-grid .card");

        cards.forEach(card => {

            card.addEventListener("click", () => {

                const title = card.querySelector("h3")?.textContent || "Module";

                showToast(title + " coming soon");

            });

        });

    },

    bindQuickActions() {

        const buttons = document.querySelectorAll(".quick-actions button");

        buttons.forEach(button => {

            button.addEventListener("click", () => {

                showToast(button.textContent);

            });

        });

    },

    bindBottomNavigation() {

        const navButtons = document.querySelectorAll(".bottom-nav button");

        navButtons.forEach(button => {

            button.addEventListener("click", () => {

                navButtons.forEach(btn => btn.classList.remove("active"));

                button.classList.add("active");

            });

        });

    }

};

/* Initialize after page load */

document.addEventListener("DOMContentLoaded", () => {

    Dashboard.init();

});
