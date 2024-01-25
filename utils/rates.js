function price_for_model (model) {
    switch (model) {
        case 'gpt-4-turbo':
            return 0.01;
        case 'gpt-4':
            return 0.03;
        case 'gpt-3.5-turbo':
            return 0.001;
        default:
            throw new Error(`Invalid model: ${model}`);
    }
}

function tokens_to_dollars (model, tokens) {
    return tokens * (price_for_model(model) / 1000);
}

module.exports = {
    price_for_model,
    tokens_to_dollars
}
