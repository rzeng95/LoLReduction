% Pre-Req : Saved data.xlsx as data.csv, so I could use importdata to
%           strip off the leading rows and columns of text.

raw = importdata('data.csv',',',1);

champnames = raw.textdata;

champnames(1,:) = []; %Strips headers so that champnames contains only champion names

M = raw.data;
% M now contains the 193x16 matrix that we wish to reduce

sz = size(M);
rows = sz(1); % 193
cols = sz(2); % 16

% Normalize matrix M
M = normc(M);

% To reduce a 193x16 matrix, we can multiply it by a 16x2 random matrix
U = rand(16,2);

R = M * U;

% R is now a 193 x 2 reduced random K-d projection matrix

X = R(:,1);
Y = R(:,2);

figure;
scatter(X,Y);
title('random k-d projection matrix');

% Outliers will be at the upper-right or lower-left corners
% We can calculate these by summing the X and Y values and finding
% the highet and lowest values

% Create matrix N such the first col contains champion names,
% the second and third columns contain the corresponding reduced X and Y values,
% and the fouth column is the sum of the X and Y values
for i=1:rows
    N{i,1} = champnames(i,1);
    N{i,2} = X(i);
    N{i,3} = Y(i);
    N{i,4} = X(i) + Y(i);
end

% Sort array N in descending column 4 order
% To make sure champion names are also sorted based on their corresponding
% col 4 values, we have to implement the following code:
% Source: http://stackoverflow.com/questions/16072984/sorting-cell-array-based-on-column-double-not-char-values

A = N(:,4);
B = N(:,1);
C = cell(numel(A),2);
[Sorted_A, Index_A] = sort(cell2mat(A), 'descend');
C(:,1) = num2cell(Sorted_A);
C(:,2) = B(Index_A);

% Now, C is the 193x2 matrix  of champion names in descending order by X+Y value.

% The 5 highest values are the first five rows of C
% The 5 lowest values are the last five rows of C

disp('5 highest X+Y values');
disp([C{1,2} C{2,2} C{3,2} C{4,2} C{5,2}]);

disp('5 lowest X+Y values');
disp([C{rows,2} C{rows-1,2} C{rows-2,2} C{rows-3,2} C{rows-4,2}]);
