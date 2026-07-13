# Conceptual Domain Model

## Model status

This model is **conceptual, non-binding, future-facing, and not an approved database migration**. It documents domain language and relationships for long-term planning. It does not alter the current frozen SQLite schema, IRAC hierarchy, parser, exporter, validator, or canonical data.

Capitalized names below identify conceptual entity types, not implemented classes or tables. Any future physical model requires separate architecture review, source analysis, privacy assessment, and migration approval.

## Concept boundaries

- **Taxonomy** organizes named biological or chemical entities into classification hierarchies.
- **Ontology** defines concepts and the meanings of relationships among them.
- **Evidence** supports, contradicts, or qualifies an assertion; it is not the assertion itself.
- **Regulation** records jurisdiction-specific legal facts and conditions with temporal validity.
- **Recommendation** proposes a context-specific action after evidence and constraint evaluation.
- **Observation** records what was seen, measured, reported, or done in a particular context.

These boundaries prevent an observed association from becoming a causal claim, a classification from becoming a use recommendation, or a registration from becoming a performance guarantee. See [ADR-002](ARCHITECTURE_DECISIONS/ADR-002-separate-observation-evidence-and-recommendation.md).

## Entity groups

### Crop biology

- **Crop:** a cultivated plant concept with governed names and identity.
- **Variety:** a named or coded variety associated with a Crop.
- **GrowthStage:** a defined developmental stage or stage range.
- **PlantPart:** an anatomical location such as leaf, stem, root, panicle, or fruit.
- **PhysiologicalProcess:** a biological process relevant to growth, stress, or injury interpretation.

### Field observations

- **Field:** a privacy-governed production area or sampling context.
- **Observation:** the event-level record that anchors who, what, when, and context.
- **Symptom:** a plant response or abnormal condition observed on the host.
- **Sign:** direct observable evidence of a causal organism or agent.
- **ImageObservation:** an image and its capture, ownership, consent, and derivation metadata.
- **Measurement:** a quantified observation with unit, method, and uncertainty where applicable.
- **EnvironmentalCondition:** weather, moisture, temperature, or related context for an Observation.
- **ObservationLocation:** a privacy-controlled spatial reference or approximate locality.

### Biotic causes

- **Insect**, **Mite**, **Nematode**, **Weed**, and **Pathogen:** governed organism or pest concepts.
- **Disease:** a condition with a defined host-cause relationship and supporting evidence.
- **PestLifeStage:** a stage relevant to identification, damage, monitoring, or management.

### Abiotic causes

- **NutrientDeficiency** and **NutrientToxicity:** nutrient-related hypotheses or confirmed conditions.
- **WaterStress:** deficit, excess, or water-distribution stress.
- **SoilCondition:** a physical or chemical soil context linked to plant response.
- **ChemicalInjury:** injury associated with chemical exposure, requiring evidence and careful attribution.
- **WeatherStress:** damage or stress associated with weather events or conditions.

### Management

- **ManagementOption:** an abstract action that may prevent, monitor, suppress, or control a target.
- **CulturalPractice**, **MechanicalPractice**, **BiologicalControl**, and **ChemicalControl:** specialized ManagementOption types.
- **IPMProgram:** an ordered, context-specific combination of monitoring and management actions.
- **EconomicThreshold:** evidence-governed conditions for considering intervention, scoped to context.
- **MonitoringMethod:** a method, sampling plan, or tool for detecting and assessing a target.

### Chemical knowledge

- **ActiveIngredient:** a chemically or biologically active substance identity.
- **ModeOfAction:** a governed classification concept describing a biological mode of action.
- **TargetSite:** a biological site or process affected by a ModeOfAction.
- **ChemicalClass:** a governed chemical classification concept.
- **Formulation:** a formulated preparation type or composition concept.
- **Mixture:** a defined combination of more than one component.
- **ResistanceGroup:** a resistance-management classification group issued by an authority.

The currently parsed IRAC group-class-active-ingredient hierarchy remains authoritative and frozen for its approved scope. This conceptual vocabulary neither replaces nor extends it.

### Regulatory

- **CommercialProduct:** a jurisdiction-specific marketed product identity; no product instances are integrated today.
- **Registration:** an official legal authorization record for a jurisdiction and validity period.
- **Label:** a versioned official label associated with a Registration.
- **ApprovedCrop** and **ApprovedTarget:** legal crop and target entries defined by a registration or label.
- **ApplicationRate:** a label-defined legal rate statement, never inferred by the system.
- **MaximumApplications:** a label-defined use limit.
- **PHI:** a label-defined pre-harvest interval.
- **REI:** a label-defined restricted-entry interval.
- **PPERequirement:** a label-defined personal protective equipment requirement.
- **RegistrationStatus:** a time-bound official state such as active, expired, suspended, or cancelled, subject to the source vocabulary.

### Safety and environmental

- **Hazard:** a governed hazard assertion with source and scope.
- **ExposureRoute:** a route through which exposure may occur.
- **HumanSafetyConstraint:** a sourced condition limiting handling or use.
- **EnvironmentalRisk:** a sourced risk assertion for an environmental context.
- **NonTargetOrganism:** an organism or group not intended as the management target.
- **WaterProtectionConstraint:** a sourced constraint intended to protect water resources.

### Evidence and provenance

- **Source:** the identity of an official, scientific, institutional, manufacturer, expert, or field source.
- **SourceVersion:** a specific immutable edition, release, label, or retrieved representation of a Source.
- **Citation:** a locator connecting an assertion to supporting source material.
- **EvidenceAssertion:** a scoped statement supported or contradicted by evidence.
- **EvidenceLevel:** the evidence classification defined in [Evidence Levels](EVIDENCE_LEVELS.md).
- **ReviewStatus:** the review lifecycle state of an assertion or derived record.
- **ProvenanceRecord:** the record of origin, extraction, transformation, review, and supersession.

### Economics

- **ProductPrice:** a dated, localized price observation, not a permanent product property.
- **ApplicationCost:** the calculated or recorded operational cost of an application scenario.
- **CostPerRai:** a scenario result using the Thai area unit rai and explicit assumptions.
- **ReapplicationRisk:** the estimated possibility and consequence of needing another intervention.
- **ExpectedControlDuration:** an evidence-qualified duration assumption, not a guarantee.
- **ExpectedLossAvoided:** a scenario estimate with uncertainty and causal assumptions.
- **ROIModel:** a versioned calculation model comparing costs and expected outcomes.

### Drone application

- **DronePlatform:** a specific platform model or operational configuration.
- **Nozzle:** a nozzle identity and relevant characteristics.
- **DropletClass:** a governed droplet-size classification.
- **SprayVolume:** a planned or recorded volume with unit and basis.
- **FlightHeight**, **FlightSpeed**, and **SwathWidth:** planned or observed flight parameters.
- **WeatherWindow:** environmental conditions considered acceptable under sourced constraints.
- **ApplicationRecord:** an auditable record of an application event and its settings.

## Key relationships and cardinality

Cardinality statements are conceptual and may require exceptions in future source-specific models.

- A **Crop** has one or more **GrowthStage** concepts; a GrowthStage may be reused by many Crops when its definition supports that scope.
- A Crop can have many **Variety** records; each Variety identifies one primary Crop.
- A Crop has many **PlantPart** concepts, and a PlantPart may apply to many Crops through scoped anatomy mappings.
- A **Symptom** affects one or more PlantParts; a PlantPart can exhibit many Symptoms.
- An **Observation** records zero or more Symptoms, Signs, ImageObservations, Measurements, EnvironmentalConditions, and ObservationLocations.
- A Symptom may indicate multiple possible biotic or abiotic causes; a possible cause may be indicated by many Symptoms.
- A **Pest** concept, represented by Insect, Mite, Nematode, Weed, Pathogen, or Disease as appropriate, can attack or affect many Crops; a Crop can have many pests.
- A Pest can have many PestLifeStages, and a PestLifeStage belongs to one pest identity within a given taxonomy.
- A **ManagementOption** may control or suppress many pests; a pest may be managed by many options. The relationship requires context and evidence.
- An **IPMProgram** combines multiple ManagementOptions and MonitoringMethods; an option can participate in many programs.
- An **EconomicThreshold** applies to a defined crop-target-context combination and may reference one or more MonitoringMethods.
- An **ActiveIngredient** has one or more ModeOfAction assertions when supported by a classification source; a ModeOfAction can classify many ActiveIngredients.
- A **ModeOfAction** affects one or more TargetSites or processes; a TargetSite can be associated with multiple modes.
- An ActiveIngredient belongs to one or more ChemicalClass or ResistanceGroup concepts according to versioned classification authorities.
- A **CommercialProduct** contains one or more ActiveIngredients through a versioned formulation; an ActiveIngredient may occur in many products.
- A **Registration** permits a CommercialProduct for specified ApprovedCrop and ApprovedTarget combinations in one jurisdiction and validity period.
- A **Label** belongs to a Registration version and defines legal ApplicationRate, MaximumApplications, PHI, REI, and PPERequirement statements where present.
- A **Recommendation** is supported by one or more EvidenceAssertions and may be contradicted or constrained by others. Recommendation is a distinct future concept, not currently implemented.
- An EvidenceAssertion has one or more Citations or explicit provenance explaining why evidence is absent; each Citation points to a SourceVersion.
- A field Observation may support a candidate assertion after review, but **must not automatically become validated scientific evidence**.
- An ApplicationRecord may reference one Field, one application time, one operational configuration, and multiple measured or derived outcomes.
- An ROIModel uses one or more price, cost, loss, duration, and risk inputs; every output retains those input versions and assumptions.

## Identity and lifecycle notes

Entities require stable internal identities separate from display labels and synonyms. Biological taxonomy, chemical classification, regulatory records, and labels can change independently, so identity mappings need source, version, and effective dates. Observations remain immutable records of reported context; corrections are appended as reviewed provenance rather than silently overwriting originals.

The conceptual graph representation and relationship metadata are expanded in [Knowledge Graph](KNOWLEDGE_GRAPH.md). Source admission and assertion review are governed by [Source Policy](SOURCE_POLICY.md), [Evidence Levels](EVIDENCE_LEVELS.md), and [Field Knowledge Policy](FIELD_KNOWLEDGE_POLICY.md).
