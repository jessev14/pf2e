import { AutomaticBonusProgression } from "@actor/character/automatic-bonus-progression";
import { CompendiumBrowser } from "@module/apps/compendium-browser";
import { EffectsPanel } from "@module/apps/effects-panel";
import { LicenseViewer } from "@module/apps/license-viewer";
import { WorldClock } from "@module/apps/world-clock";
import {
    AbilityModifier,
    CheckModifier,
    ModifierPF2e,
    MODIFIER_TYPE,
    ProficiencyModifier,
    StatisticModifier,
} from "@module/modifiers";
import { RuleElementPF2e, RuleElements } from "@module/rules";
import { StatusEffects } from "@scripts/actor/status-effects";
import { DicePF2e } from "@scripts/dice";
import { earnIncome } from "@scripts/macros/earn-income";
import { encouragingWords } from "@scripts/macros/encouraging-words";
import { rollActionMacro, rollItemMacro } from "@scripts/macros/hotbar";
import { raiseAShield } from "@scripts/macros/raise-a-shield";
import { restForTheNight } from "@scripts/macros/rest-for-the-night";
import { steelYourResolve } from "@scripts/macros/steel-your-resolve";
import { launchTravelSheet } from "@scripts/macros/travel/travel-speed-sheet";
import { calculateXP } from "@scripts/macros/xp";
import { remigrate } from "@scripts/system/remigrate";
import { ActionsPF2e } from "@system/actions/actions";
import { craft } from "@system/actions/crafting/craft";
import { ConditionManager } from "@system/conditions";
import { EffectTracker } from "@system/effect-tracker";
import { ActorImporter } from "@system/importer/actor-importer";
import { CheckPF2e } from "@system/rolls";
import { TextEditorPF2e } from "@system/text-editor";
import { sluggify } from "@util";

/** Expose public game.pf2e interface */
export const SetGamePF2e = {
    onInit: (): void => {
        const actions: Record<string, Function> = {
            earnIncome,
            encouragingWords,
            raiseAShield,
            restForTheNight,
            steelYourResolve,
            ...ActionsPF2e.actionMacros,
        };
        console.debug(ActionsPF2e.actionMacros.craft);

        Object.defineProperty(globalThis.game, "pf2e", { value: {} });

        const initSafe: Partial<typeof game["pf2e"]> = {
            actions,
            AbilityModifier: AbilityModifier,
            Check: CheckPF2e,
            CheckModifier: CheckModifier,
            ConditionManager: ConditionManager,
            Dice: DicePF2e,
            effectPanel: new EffectsPanel(),
            effectTracker: new EffectTracker(),
            gm: { calculateXP, launchTravelSheet },
            importer: { actor: ActorImporter },
            licenseViewer: new LicenseViewer(),
            Modifier: ModifierPF2e,
            ModifierType: MODIFIER_TYPE,
            ProficiencyModifier: ProficiencyModifier,
            rollActionMacro,
            rollItemMacro,
            RuleElement: RuleElementPF2e,
            RuleElements: RuleElements,
            StatisticModifier: StatisticModifier,
            StatusEffects: StatusEffects,
            system: { remigrate, sluggify },
            TextEditor: TextEditorPF2e,
            variantRules: { AutomaticBonusProgression },
        };

        mergeObject(game.pf2e, initSafe);
        game.pf2e.actions.craft = craft; // Workaround for strange import bug
    },

    onSetup: (): void => {
        game.pf2e.worldClock = new WorldClock();
    },

    onReady: (): void => {
        game.pf2e.compendiumBrowser = new CompendiumBrowser();
    },
};