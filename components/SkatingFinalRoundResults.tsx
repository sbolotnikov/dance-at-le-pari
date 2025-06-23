import React from "react";

interface FinalRoundProps {
  // Each inner array holds the judge marks for one couple.
  couplePlacements: number[][]; 
  // Array of couple numbers corresponding to the couplePlacements rows.
  coupleNumbers: number[];
  // Array of judge numbers (for informational display).
  judgeNumbers: number[];
}

// This interface holds the computed “group” values for a couple.
// For group 1 (only “1” marks), group 2 (marks 1–2), group 3 (marks 1–3), … 
interface GroupData {
  count: number; // How many marks (from judges) are within the group (<= group threshold)
  sum: number;   // The sum of those marks (a lower sum is better when counts are equal)
}

// This interface holds the computed data for one couple.
interface ComputedCouple {
  coupleNumber: number;
  placements: number[]; // The original judge marks
  groups: GroupData[];  // Array of group results — index 0 corresponds to group "1", index 1 to group “1–2”, etc.
  finalPlacement?: number;
}

const SkatingFinalRoundResults: React.FC<FinalRoundProps> = ({
  couplePlacements,
  coupleNumbers,
  judgeNumbers,
}) => {
  // Basic validation: ensure each couple has a corresponding placements array.
  if (coupleNumbers.length !== couplePlacements.length) {
    return (
      <div>
        Error: The number of couple identifiers does not match the number of
        couple placement arrays.
      </div>
    );
  }
  // Validate that every couple has as many marks as there are judges.
  for (let i = 0; i < couplePlacements.length; i++) {
    if (couplePlacements[i].length !== judgeNumbers.length) {
      return (
        <div>
          Error: Couple {coupleNumbers[i]} does not have marks from every judge.
        </div>
      );
    }
  }

  // By rule, a final round can contain a maximum of eight couples.
  // We will assume that the maximum rank (and therefore the maximum group
  // threshold) is equal to the number of couples.
  const numCouples = coupleNumbers.length;
  const maxGroup = numCouples;

  // For each couple, compute the groups array.
  // Group 1: count and sum of marks that are "≤ 1"
  // Group 2: count and sum of marks that are "≤ 2" (i.e. marks 1 or 2),
  // and so on.
  const computedCouples: ComputedCouple[] = couplePlacements.map(
    (placements, index) => {
      const groups: GroupData[] = [];
      for (let r = 1; r <= maxGroup; r++) {
        // For group "r", filter all judge marks that are ≤ r.
        const groupMarks = placements.filter((mark) => mark <= r);
        const count = groupMarks.length;
        const sum = groupMarks.reduce((acc, mark) => acc + mark, 0);
        groups.push({ count, sum });
      }
      return {
        coupleNumber: coupleNumbers[index],
        placements,
        groups,
      };
    }
  );

  // Comparison function to sort couples.
  // We compare couples group by group.
  // For each group we compare:
  //   • The count (a higher count is better),
  //   • If counts are equal then the sum (a lower sum is better).
  // This implements a lexicographic ordering over the groups.
  const compareCouple = (a: ComputedCouple, b: ComputedCouple): number => {
    for (let r = 0; r < maxGroup; r++) {
      if (a.groups[r].count > b.groups[r].count) return -1;
      if (a.groups[r].count < b.groups[r].count) return 1;
      // When counts are equal, the lower sum wins.
      if (a.groups[r].sum < b.groups[r].sum) return -1;
      if (a.groups[r].sum > b.groups[r].sum) return 1;
    }
    // If all groups are equal, then the couples are considered tied.
    return 0;
  };

  // Sort our computed couples according to the lexicographic order defined above.
  const sortedCouples = [...computedCouples].sort(compareCouple);

  // Now assign final placements.
  // When one or more couples are tied (i.e. consecutive couples where compareCouple returns 0)
  // we use the average of the positions they span.
  let i = 0;
  let rank = 1;
  while (i < sortedCouples.length) {
    // Start a new tie group.
    const tieGroup: ComputedCouple[] = [sortedCouples[i]];
    let j = i + 1;
    while (
      j < sortedCouples.length &&
      compareCouple(sortedCouples[i], sortedCouples[j]) === 0
    ) {
      tieGroup.push(sortedCouples[j]);
      j++;
    }
    // If there is a tie then the placement for each couple is the average of the positions.
    const groupPlacement =
      tieGroup.length === 1
        ? rank
        : (rank + (rank + tieGroup.length - 1)) / 2;
    tieGroup.forEach((couple) => {
      couple.finalPlacement = groupPlacement;
    });
    rank += tieGroup.length;
    i = j;
  }

  // Sort final results by final placement (if desired, you can also sort by couple number)
  const finalResults = [...sortedCouples].sort((a, b) => {
    if (a.finalPlacement! === b.finalPlacement!) {
      return a.coupleNumber - b.coupleNumber;
    }
    return a.finalPlacement! - b.finalPlacement!;
  });

  return (
    <div>
      <h2>Final Round Results</h2>
      <p>
        The calculations are based on counting for each couple, for groups “1”,
        “1–2”, “1–3”, &hellip;, the number of placements that fall within each
        group together with the sum of those marks. The couples are then ranked
        lexicographically by these results (using higher counts and lower sums as
        tie-breakers). In ties the average placement is assigned.
      </p>
      <table border={1} cellPadding={6} cellSpacing={0}>
        <thead>
          <tr>
            <th>Couple Number</th>
            <th>Final Placement</th>
            {/*
              For each group (from 1 to maxGroup) we display a header showing
              the group name along with the fact that we are showing Count and
              Sum.
            */}
            {Array.from({ length: maxGroup }, (_, idx) => (
              <th key={`group-${idx}`}>
                Group {idx + 1}
                <br />
                (Count / Sum)
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {finalResults.map((couple) => (
            <tr key={couple.coupleNumber}>
              <td>{couple.coupleNumber}</td>
              <td>{couple.finalPlacement}</td>
              {couple.groups.map((group, idx) => (
                <td key={`couple-${couple.coupleNumber}-group-${idx}`}>
                  {group.count} / {group.sum}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Judges: {judgeNumbers.join(", ")} (Total: {judgeNumbers.length})
      </p>
    </div>
  );
};


export default SkatingFinalRoundResults;