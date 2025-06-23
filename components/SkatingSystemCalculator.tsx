// src/components/SkatingSystemCalculator.tsx

import React, { useState, useEffect } from 'react';

// --- Type Definitions ---

export interface CouplePlacementInput {
  coupleNumber: string | number;
  judgeMarks: number[]; // Marks from each judge for this couple, e.g., [1, 2, 1]
}

export interface SkatingSystemCalculatorProps {
  /**
   * Array of objects, each representing a couple and their marks from all judges.
   * Example: [{ coupleNumber: 101, judgeMarks: [1, 2, 1] }, { coupleNumber: 102, judgeMarks: [2, 1, 3] }]
   * Assumes judgeMarks[i] is the mark from judge i for that couple.
   */
  couplesData: CouplePlacementInput[];
  /**
   * Optional: Array of judge identifiers, mainly for context or potential detailed display.
   * The length of this array should match the length of each couple's judgeMarks array.
   */
  judgeIdentifiers?: (string | number)[];
}

export interface PlacementResult {
  coupleNumber: string | number;
  finalPlacement: number; // Numeric placement, can be e.g., 3.5 for ties
  announcedPlacement: string; // User-friendly announcement, e.g., "3rd" or "Tied 3rd"
  // For detailed view, one might add how placement was derived
  calculationTrace?: string[];
}

interface CoupleCalculationData {
  coupleNumber: string | number;
  marks: number[]; // Marks received from judges
  isPlaced: boolean;
  finalPlacement: number | null;
  announcedPlacement: string | null;
  // Temporary fields for current round of calculation
  majorityCountForCurrentCheck: number;
  sumForCurrentCheck: number;
}

// --- Helper Functions ---

function getMajority(numJudges: number): number {
  if (numJudges <= 0) return 1; // Or throw error
  return Math.floor(numJudges / 2) + 1;
}

function calculateLowestSum(marks: number[], numMarksToConsider: number): number {
  return marks.slice(0, numMarksToConsider).reduce((acc, m) => acc + m, 0);
}


// --- Core Skating System Logic ---
function calculateSkatingPlacements(
  initialCouplesData: ReadonlyArray<CouplePlacementInput>,
  numJudges: number
): PlacementResult[] {
  if (!initialCouplesData || initialCouplesData.length === 0) {
    return [];
  }
  if (numJudges === 0) {
      return initialCouplesData.map(c => ({
          coupleNumber: c.coupleNumber,
          finalPlacement: 0,
          announcedPlacement: "N/A - No Judges",
          calculationTrace: ["No judges provided."]
      }));
  }

  const numCouples = initialCouplesData.length;
  if (numCouples > 8) {
    // As per Rule 2, more than 8 couples requires a preliminary round, not a final.
    // This component handles a final round.
    console.warn("Warning: More than 8 couples in a final round. Results may not be standard.");
    // Or throw new Error("Cannot run a final with more than 8 couples according to Rule 2.");
  }

  // Rule 2 & 4 check (basic): Each judge must mark each couple, and no ties from a judge.
  // For simplicity, this validation is assumed to be handled by input structure or a dedicated validation step.
  // This implementation expects `judgeMarks` to be correctly formatted.

  let couples: CoupleCalculationData[] = initialCouplesData.map(cd => ({
    coupleNumber: cd.coupleNumber,
    marks: [...cd.judgeMarks].sort((a, b) => a - b), // Sort marks for easier processing (e.g. 1,1,2,3)
    isPlaced: false,
    finalPlacement: null,
    announcedPlacement: null,
    majorityCountForCurrentCheck: 0,
    sumForCurrentCheck: 0,
  }));

  const majority = getMajority(numJudges);
  let currentPlacementToAward = 1;
  const finalResults: PlacementResult[] = [];

  while (finalResults.length < numCouples && currentPlacementToAward <= numCouples) {
    let unplacedCouples = couples.filter(c => !c.isPlaced);
    if (unplacedCouples.length === 0) break;

    // If only one unplaced couple remains, they get the current placement
    if (unplacedCouples.length === 1) {
      const lastCouple = unplacedCouples[0];
      lastCouple.isPlaced = true;
      lastCouple.finalPlacement = currentPlacementToAward;
      lastCouple.announcedPlacement = `${currentPlacementToAward}`;
      finalResults.push({
        coupleNumber: lastCouple.coupleNumber,
        finalPlacement: lastCouple.finalPlacement,
        announcedPlacement: formatPlacement(lastCouple.finalPlacement),
      });
      currentPlacementToAward++;
      continue;
    }

    let foundPlacementInThisIteration = false;

    // Rule 5, 8: Iterate through "kth place or better"
    for (let k = 1; k <= numCouples; k++) { // k is the mark we are counting (1st, then 1st-2nd, etc.)
      let contenders: CoupleCalculationData[] = [];

      unplacedCouples.forEach(couple => {
        const countKOrBetter = couple.marks.filter(mark => mark <= k).length;
        couple.majorityCountForCurrentCheck = countKOrBetter;
        if (countKOrBetter >= majority) {
          couple.sumForCurrentCheck = couple.marks.filter(mark => mark <= k).reduce((a, b) => a + b, 0);
          contenders.push(couple);
        } else {
          couple.sumForCurrentCheck = Infinity; // Not a contender for sums
        }
      });

      if (contenders.length > 0) {
        // Sort contenders:
        // 1. By highest majority count (Rule 6)
        // 2. By lowest sum of those marks (Rule 7 part 1)
        contenders.sort((a, b) => {
          if (a.majorityCountForCurrentCheck !== b.majorityCountForCurrentCheck) {
            return b.majorityCountForCurrentCheck - a.majorityCountForCurrentCheck; // Higher count is better
          }
          return a.sumForCurrentCheck - b.sumForCurrentCheck; // Lower sum is better
        });
        
        // Check for ties after initial sort (Rule 7, recursive part if sums are equal)
        let processedContendersForThisK: CoupleCalculationData[] = [];
        let i = 0;
        while (i < contenders.length) {
            let tiedGroup = [contenders[i]];
            let j = i + 1;
            while (j < contenders.length &&
                   contenders[j].majorityCountForCurrentCheck === contenders[i].majorityCountForCurrentCheck &&
                   contenders[j].sumForCurrentCheck === contenders[i].sumForCurrentCheck) {
                tiedGroup.push(contenders[j]);
                j++;
            }

            if (tiedGroup.length > 1) {
                // Rule 7 Part 3: Equal majority and equal sum, try next column (k+1) for these couples ONLY
                // This requires a recursive or iterative tie-breaking step.
                // For simplicity in this main loop, we'll re-evaluate ties in a dedicated step if they persist.
                // A true Rule 7 deep tie break would be complex here.
                // The current sort handles the "first pass" of Rule 7. If sums are equal, their order is maintained.
                // A full Rule 7 tie-break needs to iterate k for *just the tied group*.
                // Let's refine this specific tie-breaking:
                const fullyResolvedTies = resolveDeepTies(tiedGroup, k + 1, numCouples, majority, numJudges);
                processedContendersForThisK.push(...fullyResolvedTies);
            } else {
                processedContendersForThisK.push(...tiedGroup);
            }
            i = j;
        }
        contenders = processedContendersForThisK;


        // Award placements based on the sorted contenders
     // Replace this entire block in calculateSkatingPlacements:
/*
        const placementsToAwardInThisBlock = Math.min(contenders.length, unplacedCouples.length - finalResults.filter(fr => fr.finalPlacement >= currentPlacementToAward).length);
        const actualPlacementsValues = Array.from({ length: placementsToAwardInThisBlock }, (_, idx) => currentPlacementToAward + idx);

        let groupToPlace = contenders.slice(0, placementsToAwardInThisBlock);

        let trueTieOccurred = false;
        if (groupToPlace.length > 1) {
            const first = groupToPlace[0];
            trueTieOccurred = groupToPlace.every(c =>
                c.majorityCountForCurrentCheck === first.majorityCountForCurrentCheck &&
                c.sumForCurrentCheck === first.sumForCurrentCheck &&
                checkIfTrulyTied(groupToPlace[0], c, numCouples, majority) // Problematic line
            );
        }
        // ... rest of the old block ...
*/

// With this new, more direct logic:
if (contenders.length > 0) {
    const topContender = contenders[0];
    let numberOfCouplesInCurrentTieBlock = 0;

    // Determine how many couples are tied with the topContender
    // based on their state *after* all tie-breaking attempts (including resolveDeepTies).
    // The majorityCountForCurrentCheck and sumForCurrentCheck on these contenders
    // will be from the *last k* they were evaluated against.
    for (let l = 0; l < contenders.length; l++) {
        if (contenders[l].majorityCountForCurrentCheck === topContender.majorityCountForCurrentCheck &&
            contenders[l].sumForCurrentCheck === topContender.sumForCurrentCheck) {
            numberOfCouplesInCurrentTieBlock++;
        } else {
            // End of the current tie block at the top of the contenders list
            break;
        }
    }

    const groupToPlace = contenders.slice(0, numberOfCouplesInCurrentTieBlock);

    if (groupToPlace.length > 1) {
        // This is an unbreakable tie for this block of placements
        const numTied = groupToPlace.length;
        const placementsBeingTiedFor = Array.from({ length: numTied }, (_, idx) => currentPlacementToAward + idx);
        const tiedPlacementValue = placementsBeingTiedFor.reduce((sum, p) => sum + p, 0) / numTied;
        // Announce with the highest placement in the tied block (e.g., "Tied 3rd" for 3rd, 4th, 5th)
        const announcedTiePlacement = formatPlacement(currentPlacementToAward, true);

        groupToPlace.forEach(couple => {
            if (couple.isPlaced) return; // Should not happen if logic is correct
            couple.isPlaced = true;
            couple.finalPlacement = tiedPlacementValue;
            couple.announcedPlacement = announcedTiePlacement;
            finalResults.push({
                coupleNumber: couple.coupleNumber,
                finalPlacement: couple.finalPlacement,
                announcedPlacement: couple.announcedPlacement,
            });
        });
        currentPlacementToAward += numTied;

    } else if (groupToPlace.length === 1) {
        // Single couple wins this placement (or was at the top of a resolved tie)
        const coupleToPlace = groupToPlace[0];
        if (!coupleToPlace.isPlaced) { // Ensure not already placed by a broader tie
            coupleToPlace.isPlaced = true;
            coupleToPlace.finalPlacement = currentPlacementToAward;
            coupleToPlace.announcedPlacement = formatPlacement(currentPlacementToAward);
            finalResults.push({
                coupleNumber: coupleToPlace.coupleNumber,
                finalPlacement: coupleToPlace.finalPlacement,
                announcedPlacement: coupleToPlace.announcedPlacement,
            });
            currentPlacementToAward++;
        } else {
             // This case might occur if a broader tie placed this couple,
             // and then subsequent contenders were processed.
             // Essentially, if already placed, we just need to ensure currentPlacementToAward advances correctly
             // if this was the only one considered in groupToPlace.
             // However, the outer loops should handle advancing currentPlacementToAward.
             // This specific else might be redundant if the main loop correctly filters unplacedCouples.
        }
    }

    foundPlacementInThisIteration = true;
    // No 'break' here, allow the k-loop to finish, then the while loop will re-evaluate unplacedCouples.
    // Actually, we DO need to break from the k-loop, because placements for *this targetPlacement* have been made.
    // The `while` loop will then restart the process for the *new* currentPlacementToAward.
}
// The break should be outside the if (contenders.length > 0)
if (foundPlacementInThisIteration) {
    break; // Break from the `for (let k = 1; k <= numCouples; k++)` loop
}

 
      }
    } // End of k loop (Rule 5, 8)

    if (!foundPlacementInThisIteration && unplacedCouples.length > 0) {
      // This should theoretically not be reached if rules are complete for all scenarios.
      // It might mean no couple could achieve a majority even up to Nth mark.
      // This could happen if there's a data issue or an extreme edge case not covered.
      // As a fallback, place remaining equally or based on input order or throw error.
      console.error("Skating System Error: Could not determine placement for all couples.", unplacedCouples);
      unplacedCouples.forEach(couple => {
        if (!couple.isPlaced) {
          const tiedAvgPlacement = (currentPlacementToAward + (currentPlacementToAward + unplacedCouples.length -1)) / 2;
          couple.isPlaced = true;
          couple.finalPlacement = tiedAvgPlacement; // Or some error indicator
          couple.announcedPlacement = formatPlacement(currentPlacementToAward, true) + " (Fallback)";
           finalResults.push({
            coupleNumber: couple.coupleNumber,
            finalPlacement: couple.finalPlacement,
            announcedPlacement: couple.announcedPlacement,
          });
        }
      });
      currentPlacementToAward += unplacedCouples.length;
      break; 
    }
  }

  return finalResults.sort((a,b) => (a.finalPlacement ?? Infinity) - (b.finalPlacement ?? Infinity));
}

// Helper for Rule 7 Part 3: If initial majority count and sum are equal for a group,
// recursively check subsequent columns (k+1, k+2, ...) for THAT GROUP ONLY.
function resolveDeepTies(
    tiedCouples: CoupleCalculationData[],
    startK: number,
    maxK: number, // numCouples
    majority: number,
    numJudges: number // For re-calculating majority if needed, though it's fixed
): CoupleCalculationData[] {
    if (tiedCouples.length <= 1 || startK > maxK) {
        return tiedCouples; // Base case: no tie or no more columns to check
    }

    let currentK = startK;
    let stillTiedGroup = [...tiedCouples];
    console.log(`Resolving deep ties for k=${currentK}, maxK=${maxK}, majority=${majority}`, stillTiedGroup);
    while (currentK <= maxK && stillTiedGroup.length > 1) {
        // Calculate majority counts and sums for this specific k for the stillTiedGroup
        stillTiedGroup.forEach(couple => {
            const countKOrBetter = couple.marks.filter(mark => mark <= currentK).length;
            couple.majorityCountForCurrentCheck = countKOrBetter; // This count is for marks up to currentK
            if (countKOrBetter >= majority) { // Check if they *still* hold a majority with marks up to currentK
                couple.sumForCurrentCheck = couple.marks
                    .filter(mark => mark <= currentK)
                    .reduce((a, b) => a + b, 0);
            } else {
                // If a couple loses majority when considering more marks, they might rank lower
                // This rule is tricky: "we go to the next column, FOR THESE COUPLES ONLY."
                // Assumes they retain their tied status and we are just looking for a differentiator.
                 couple.sumForCurrentCheck = Infinity; // Effectively, they are worse if they lose majority
                 // A better approach might be to penalize or handle this specific scenario from Rule 7 text.
                 // Rule 7: "If the next column still gives us an equal majority and sum we go to the next column"
                 // This implies we are always checking for majority *at that new column level*.
                 // If they had a majority for k-1, and now for k, we check.
                 // Let's stick to the sum for those who maintain *some* majority.
                 // The problem wording for Rule 7 doesn't explicitly state they must maintain the *same* majority count as before,
                 // just that *if* they have an equal majority (for the new k) and sum, continue.
                 // This usually means they must still have *a* majority.
            }
        });

        // Sort *only this group* by the new counts and sums for currentK
        stillTiedGroup.sort((a, b) => {
            // If one no longer has majority for marks <= currentK, they are 'worse' in this tie-break
            const aHasMajorityAtCurrentK = a.marks.filter(mark => mark <= currentK).length >= majority;
            const bHasMajorityAtCurrentK = b.marks.filter(mark => mark <= currentK).length >= majority;

            if (aHasMajorityAtCurrentK && !bHasMajorityAtCurrentK) return -1;
            if (!aHasMajorityAtCurrentK && bHasMajorityAtCurrentK) return 1;
            if (!aHasMajorityAtCurrentK && !bHasMajorityAtCurrentK) { // Both lost majority, consider them still tied for now or by sum of all marks
                 // For simplicity, if both lose majority, their relative order won't change based on this k.
                 // Consider sum of ALL marks up to currentK if both fail majority.
                 const sumA = a.marks.filter(mark => mark <= currentK).reduce((s,m)=>s+m,0);
                 const sumB = b.marks.filter(mark => mark <= currentK).reduce((s,m)=>s+m,0);
                 if (sumA !== sumB) return sumA - sumB;
                 return 0; // Remain tied if sums also equal
            }

            // Both have majority at currentK, compare their sums for marks <= currentK
             if (a.sumForCurrentCheck !== b.sumForCurrentCheck) {
                return a.sumForCurrentCheck - b.sumForCurrentCheck;
            }
            return 0; // Still tied on sum for this k
        });
        
        // If the first two are no longer tied by sum, the tie is broken for this level.
        if (stillTiedGroup.length > 1 && stillTiedGroup[0].sumForCurrentCheck !== stillTiedGroup[1].sumForCurrentCheck) {
             // Tie broken, return the newly sorted group
            return stillTiedGroup;
        }
        // If all in stillTiedGroup remain perfectly tied (same sum at currentK), continue to next k.
        // Check if *all* elements in stillTiedGroup have the same sum.
        const firstSum = stillTiedGroup[0].sumForCurrentCheck;
        if (stillTiedGroup.every(c => c.sumForCurrentCheck === firstSum)) {
            currentK++; // Move to next k if all are still tied
        } else {
            // Group has been differentiated, some have different sums.
            return stillTiedGroup;
        }

    }
    // If loop finishes, stillTiedGroup contains couples that are tied through all columns up to maxK
    return stillTiedGroup; 
}

// Simplified check for truly tied - this is complex per Rule 7
function checkIfTrulyTied(c1: CoupleCalculationData, c2: CoupleCalculationData, numCouples: number, majority: number): boolean {
    if (c1.coupleNumber === c2.coupleNumber) return true; // same couple

    // This function would essentially re-run the resolveDeepTies logic for just two couples
    // and see if they end up in the same state.
    // For this component's scope, if they passed the main sort and resolveDeepTies together,
    // we'll consider them tied for announcement purposes if their final calculated values are identical.
    // The crucial part is that their numerical placement *value* will be averaged if they are truly unbreakable.
    
    // A practical check after all calculations: if their `finalPlacement` value (numeric) is identical, they are tied.
    // The logic within calculateSkatingPlacements for averaging handles the numeric part.
    // This function is more about *deciding* if the tie announcement is appropriate.

    // If their majority counts and sums that *led to their current consideration* are equal,
    // and they weren't separated by resolveDeepTies, they are tied *for this block*.
    if (c1.majorityCountForCurrentCheck === c2.majorityCountForCurrentCheck && c1.sumForCurrentCheck === c2.sumForCurrentCheck) {
        // Re-simulate deep tie check just for these two to be absolutely sure
        const resultOfPairTieBreak = resolveDeepTies([ {...c1}, {...c2} ], 1, numCouples, majority, 0 /*numJudges not needed here as marks are fixed*/);
        // If after deep tie break, their relevant metrics (e.g. final sum across all k's) are still equal
        // This needs careful definition of "equal" after deep tie.
        // Simplification: if resolveDeepTies didn't separate them earlier when called with the whole group,
        // and their current check values are identical, they are part of the same tie block.
        return resultOfPairTieBreak[0].sumForCurrentCheck === resultOfPairTieBreak[1].sumForCurrentCheck &&
               resultOfPairTieBreak[0].majorityCountForCurrentCheck === resultOfPairTieBreak[1].majorityCountForCurrentCheck;
    }
    return false;
}


function formatPlacement(placement: number | null, isTied: boolean = false): string {
  if (placement === null) return "N/A";
  
  const roundedPlacement = Math.floor(placement); // For announcement, use the higher placement value in a tie
  let suffix = "th";
  if (roundedPlacement % 10 === 1 && roundedPlacement % 100 !== 11) suffix = "st";
  else if (roundedPlacement % 10 === 2 && roundedPlacement % 100 !== 12) suffix = "nd";
  else if (roundedPlacement % 10 === 3 && roundedPlacement % 100 !== 13) suffix = "rd";

  return `${isTied ? "Tied " : ""}${roundedPlacement}${suffix}`;
}


// --- React Component ---

const SkatingSystemCalculator: React.FC<SkatingSystemCalculatorProps> = ({
  couplesData,
  judgeIdentifiers,
}) => {
  const [results, setResults] = useState<PlacementResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (!couplesData || couplesData.length === 0) {
      setResults([]);
      return;
    }

    const numJudges = judgeIdentifiers?.length || couplesData[0]?.judgeMarks?.length || 0;

    // Validation
    if (numJudges === 0 && couplesData.length > 0) {
        setError("Number of judges cannot be determined or is zero.");
        setResults(couplesData.map(c => ({
            coupleNumber: c.coupleNumber,
            finalPlacement: 0,
            announcedPlacement: "Error: No Judges",
        })));
        return;
    }
    if (couplesData.length > 8) {
        // This is a warning, processing will continue but it's against "Rule 2" for a typical final.
        console.warn("Processing more than 8 couples in a final round.");
    }
    for (const couple of couplesData) {
        if (couple.judgeMarks.length !== numJudges) {
            setError(`Couple ${couple.coupleNumber} has an inconsistent number of judge marks. Expected ${numJudges}.`);
            setResults([]);
            return;
        }
        // Rule 4 check: A judge may not tie any couple for any place.
        // This needs to be checked on the raw input *before* it's structured into CouplePlacementInput
        // or validated here if raw judge sheets were the input.
        // For this component, we assume `judgeMarks` for a couple are distinct *if they came from different judges*.
        // The problem is if a *single judge's sheet* had ties, which is not this component's direct input form.
        // Rule 3: Marks are 1, 2, 3...
        for (const mark of couple.judgeMarks) {
            if (mark < 1 || mark > couplesData.length) {
                 // Technically, a judge can give a mark up to the number of couples on the floor.
                 // If there are 6 couples, marks are 1-6.
                setError(`Invalid mark ${mark} for couple ${couple.coupleNumber}. Marks should be between 1 and ${couplesData.length}.`);
                setResults([]);
                return;
            }
        }
    }


    try {
        const calculatedPlacements = calculateSkatingPlacements(couplesData, numJudges);
        setResults(calculatedPlacements);
    } catch (e: any) {
        setError(e.message || "An error occurred during calculation.");
        setResults([]);
    }

  }, [couplesData, judgeIdentifiers]);

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (results.length === 0 && couplesData.length > 0 && !error) {
    return <div>Calculating...</div>;
  }
  
  if (results.length === 0 && couplesData.length === 0) {
      return <div>No couple data provided.</div>;
  }

  return (
    <div>
      <h3>Final Placements</h3>
      {results.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Couple Number</th>
              <th>Final Placement</th>
              <th>Announced As</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res) => (
              <tr key={res.coupleNumber}>
                <td>{res.coupleNumber}</td>
                <td>{res.finalPlacement.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})}</td>
                <td>{res.announcedPlacement}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !error && <p>No results to display. Ensure data is provided.</p>
      )}
      
      {/* Optional: Display input data for verification */}
      <h4>Input Data:</h4>
      {couplesData.map(couple => (
        <div key={couple.coupleNumber}>
            Couple {couple.coupleNumber}: Marks [{couple.judgeMarks.join(', ')}]
        </div>
      ))}
    </div>
  );
};

export default SkatingSystemCalculator;