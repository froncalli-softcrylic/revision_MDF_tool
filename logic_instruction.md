# Context and Role
You are an expert Front-End/Full-Stack Developer and Marketing Data Architect. Your task is to build a modern, seamless, and highly responsive web application: a **Data-Centric Marketing Data Foundation (MDF) Simulator**. 

Unlike a standard architecture diagramming tool, this application focuses strictly on **the data lifecycle**. It visually simulates how raw, messy, disconnected data from various sources passes through an enterprise MDF, gets cleaned, stitched together, and emerges as a "Golden Record" (Unified Profile) ready for downstream marketing activation.

# Core Business Logic & MDF Rules (Based on our Canonical Image)
The application must adhere strictly to the following architectural rules:
1. **The Ultimate Rule:** Raw data from sources CANNOT bypass the MDF to go straight to the MarTech stack. It *must* pass through the MDF to become a Unified Profile before a CDP or Campaign tool can use it.
2. **The Infrastructure Categories (Inputs):** Data must originate from specific architectural buckets:
   - *Data Lake:* Behavioral Data, Paid Media Data.
   - *EDW (Enterprise Data Warehouse):* 1st Party Data (Sales, Memberships).
   - *Customer Centric Data Sources:* CRM, Service data.
3. **Ingestion Paths:** Data flows into the MDF via two distinct paths: *Realtime Ingestion* (streaming events) and *Batch Ingestion* (daily file drops).
4. **The Core MDF Engine (The 4 Pillars):** The center of the app represents the MDF, performing four specific actions:
   - *Data Hygiene:* Standardizes phone numbers, emails, name casing.
   - *Identity Resolution:* Stitches disparate IDs (cookies, emails, CRM IDs).
   - *Unified Profile (Graph Database):* Creates a 360-degree view (Shopping, Email, Mobile, Web).
   - *Measurement:* Calculates KPIs and attribution on the clean data.
5. **The Outputs (Composable MarTech):** Clean data feeds UP into: CDP (Audience Management), Journey Orchestration, Campaign Management, and Personalization.
6. **Governance Rails:** The system must visually represent Enterprise Controls (User Management, Meta Data Store, Access Store) wrapping the MDF.

# UI/UX & Layout Architecture
The design must be incredibly modern, clean, seamless, and optimized (think Vercel/Linear design systems: subtle glassmorphism, smooth Framer Motion animations, crisp typography). Use a **Responsive 3-Column Layout**:

## Column 1: Client Data Infrastructure & Ingestion (Left)
*   **Purpose:** Let the user select their current data sources and see how they are classified.
*   **Components:** 
    *   Categorized toggles:
        *   *Data Lake Sources:* Web Analytics (GA4), Paid Media Logs (Meta/Google Ads). *Visual indicator: Flows via Realtime Ingestion.*
        *   *EDW / Customer Data Sources:* CRM (Salesforce), POS/Commerce (Shopify), Marketing Automation (Marketo). *Visual indicator: Flows via Batch Ingestion.*
    *   A prominent **"Run MDF Simulation"** button to start the synthetic data flow.

## Column 2: The MDF Engine & Customer Directory (Center - The Main Stage)
*   **Purpose:** Visualize the data transformation, the 4 MDF pillars, and display the resulting Golden Records.
*   **Top Half (The Pipeline Visualizer):** A clean, animated pipeline showing the data flowing through the Core MDF stages: *Data Hygiene -> Identity Resolution -> Unified Profile -> Measurement*, and finally flowing UP to the *Composable MarTech Stack* buckets (CDP, Orchestration, Personalization).
    *   *Governance Visual:* Include a visual "rail" or sidebar on this pipeline representing the Governance controls (Access, Meta Data).
*   **Bottom Half (The Customer Directory & Story):** Once the simulation runs, this populates with a list of synthetic, unified customers.
    *   **The List:** A directory of merged users.
    *   **The Customer Story (Detail View):** When clicked, it opens a rich profile card that *tells a story*. 
    *   *Example Story:* "Jane Doe" was created by merging an anonymous web session (Realtime), a lead form (Batch), and a purchase history (Batch). 
    *   *Details to show:* Total LTV, recent purchases (e.g., "Purchased a 4K TV for $800"), cross-channel touchpoints.
    *   *Show the "Before & After":* Visually demonstrate how messy raw data (e.g., mismatched phone numbers) was standardized by the *Data Hygiene* module, and how the *Identity Resolution* module used an email to link the cookie to the CRM ID.

## Column 3: The AI Assistant / Guide (Right)
*   **Purpose:** An LLM-powered chat interface acting as an MDF Consultant.
*   **Behavior:** 
    *   Reacts dynamically. If the user selects GA4 and Salesforce, the AI explains how the MDF will use Identity Resolution to tie anonymous behavioral data (Data Lake) to 1st party sales data (EDW).
    *   During simulation, the AI acts as a narrator: "Notice how the MDF stripped the messy formatting from CRM phone numbers and mapped the web cookie to the purchaser ID, feeding a perfect Golden Record up to the CDP."

# Data Simulation Requirements
*   **Synthetic Data Generation:** Write realistic synthetic data generators in the frontend state (e.g., Zustand). 
*   Generate messy arrays (e.g., CRM contacts with unformatted phone numbers, Web events with only device_ids and IP addresses).
*   The simulation logic must physically write the code to *clean* the strings (Hygiene) and *merge* the objects based on matching keys (Identity Resolution), outputting a final array of `UnifiedProfile` objects.

# Tech Stack & Implementation Instructions
*   **Framework:** Next.js (App Router), React, TypeScript.
*   **Styling:** Tailwind CSS, `lucide-react` for icons.
*   **Animations:** Framer Motion (use layout animations for the data merging visual and column transitions).
*   **State Management:** Zustand (create a store that holds `selectedSources`, `rawSyntheticData`, `processingStage`, and `unifiedProfiles`).
*   **AI Integration:** Create a mock or ready-to-wire chat component that reads the current Zustand state to generate contextual prompts.

# Your Task
Please provide the complete implementation for this application. Break your response down into:
1.  **State Management (`store.ts`):** The Zustand store defining the synthetic data models, the cleaning/merging logic (Hygiene & Identity Resolution), and the simulation steps.
2.  **Layout & UI Components:** The code for the 3-column layout, ensuring it is beautiful and modern.
3.  **Column 1 (Infrastructure):** The component to select sources (categorized by EDW/Lake) and trigger the simulation.
4.  **Column 2 (MDF & Profiles):** The visualization of the 4 MDF pillars, the Governance rails, the MarTech outputs, and the rich "Customer Story" detail view showing the before/after of the data.
5.  **Column 3 (AI Agent):** The chat interface component that reacts to the simulation state.