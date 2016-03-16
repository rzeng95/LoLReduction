% Now we will run a PCA (a "better" way of dimensional reduction) on our data

raw = importdata('data.csv',',',1);

headers = raw.textdata;
headers = headers(1,2:17);
metrics = headers';


M = raw.data;
% M contains the original 193x16 matrix

% Run SVD on the correlation matrix of M
[U,S,V] = svd( corr(M) );

% Create first two principal components
coeff1 = M * U(:,1);
coeff2 = M * U(:,2);

% Plot coeff2 against coeff1
figure;
scatter(coeff1, coeff2);
title('Second PC component vs First PC component');

% Create matrix E, where we can find the most impactful metrics.
for i=1:16
    E{i,1} = metrics(i,1);
    E{i,2} = abs( V(i,1) ); % First principal eigenvector
    E{i,3} = abs( V(i,2) ); % Second principal eigenvector
    E{i,4} = abs( V(i,3) ); % Third principal eigenvector
end
